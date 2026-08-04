import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@clerk/expo';
import { API_BASE_URL } from '@/constants/api';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export const useApi = () => {
  const { getToken, signOut } = useAuth();
  const router = useRouter();

  const getTokenRef = useRef(getToken);
  const signOutRef = useRef(signOut);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    signOutRef.current = signOut;
  }, [signOut]);

  const handleUnauthorized = useCallback(async () => {
    await signOutRef.current();
    router.replace('/auth/sign-in');
  }, [router]);

  const handleForbidden = useCallback(async (errorMsg: string) => {
    if (errorMsg === "User account is pending approval or has been rejected.") {
      Alert.alert("Pending Approval", "Your account is awaiting administrator approval.");
    } else if (errorMsg === "User account is currently inactive.") {
      Alert.alert("Account Inactive", "Your account has been deactivated.");
    } else {
      Alert.alert("Access Denied", "You do not have permission to access this feature.");
    }
  }, []);

  const request = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    try {
      const token = await getTokenRef.current();

      const headers = new Headers(options.headers);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      const config: RequestInit = {
        ...options,
        headers,
      };

      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

      const response = await fetch(url, config);

      if (response.status === 401) {
        await handleUnauthorized();
        throw new Error('Unauthorized');
      }

      if (response.status === 403) {
        let msg = "Forbidden";
        try {
          const data = await response.json();
          msg = data.error || msg;
        } catch { }
        await handleForbidden(msg);
        throw new Error(msg);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }, [handleForbidden, handleUnauthorized]);

  return useMemo(
    () => ({
      request,
    }),
    [request]
  );
};
