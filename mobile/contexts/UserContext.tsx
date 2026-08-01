import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useAuth } from "@clerk/expo";
import { API_BASE_URL } from "@/constants/api";

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

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

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

      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const json = await response.json();

      setUser(json.data);
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      void fetchProfile();
    }
  }, [isLoaded, isSignedIn]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refresh: fetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};