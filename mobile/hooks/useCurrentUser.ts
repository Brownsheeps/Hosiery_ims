import { useUserContext } from '@/contexts/UserContext';

/**
 * Returns the current authenticated user's profile stored globally.
 * Contains loading, error states, and a refresh function to manually trigger a re-fetch.
 */
export const useCurrentUser = () => {
  const { user, loading, error, refresh } = useUserContext();
  return { user, loading, error, refresh };
};
