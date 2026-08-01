/**
 * User status constants for approval workflow.
 */
export const USER_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

/**
 * User role constants for authorization.
 */
export const USER_ROLE = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
} as const;

/**
 * Standardized authentication and authorization error messages.
 */
export const AUTH_ERRORS = {
  NO_TOKEN: "No authentication token provided.",
  INVALID_TOKEN: "Invalid or expired authentication token.",
  USER_NOT_FOUND: "User not found in the system.",
  USER_NOT_APPROVED: "User account is pending approval or has been rejected.",
  USER_INACTIVE: "User account is currently inactive.",
  FORBIDDEN: "You do not have permission to perform this action.",
} as const;
