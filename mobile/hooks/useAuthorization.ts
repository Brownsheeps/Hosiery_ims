import { useCurrentUser } from './useCurrentUser';

/**
 * Convenience hook that exposes boolean flags and robust permission checking against the current user context.
 */
export const useAuthorization = () => {
  const { user, loading, error, refresh } = useCurrentUser();

  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const isApproved = user?.status === 'APPROVED';
  const isActive = user?.is_active === true;
  const isPending = user?.status === 'PENDING';
  const isRejected = user?.status === 'REJECTED';

  /**
   * Evaluates if the current user profile has any of the requested roles.
   */
  const hasRole = (...roles: string[]) => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  };

  return {
    user,
    loading,
    error,
    refresh,
    isAdmin,
    isEmployee,
    isApproved,
    isActive,
    isPending,
    isRejected,
    hasRole,
  };
};
