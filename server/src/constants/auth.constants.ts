/** Supported lifecycle states for application users. */
export const USER_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

/** Roles that determine a user's authorization level. */
export const USER_ROLE = {
  ADMIN: "Admin",
  EMPLOYEE: "Employee",
} as const;

/** Standard authorization error messages returned by protected resources. */
export const AUTH_ERRORS = {
  NO_TOKEN: "Authorization token is required.",
  INVALID_TOKEN: "Authorization token is invalid or expired.",
  USER_NOT_FOUND: "Authenticated user was not found.",
  USER_NOT_APPROVED: "User account has not been approved.",
  USER_INACTIVE: "User account is inactive.",
  FORBIDDEN: "You do not have permission to perform this action.",
} as const;
