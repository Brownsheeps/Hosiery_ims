import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/expo';
import { useApi } from '@/hooks/useApi';

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string | null;
  status: string;
  is_active: boolean;
};

type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { request } = useApi();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!isSignedIn) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      // useApi automatically catches 401/403 and alerts! 
      const res = await request('/api/users/me');
      if (res.ok) {
        const json = await res.json();
        setUser(json.data);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded, isSignedIn]);

  return (
    <UserContext.Provider value={{ user, loading, error, refresh: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
