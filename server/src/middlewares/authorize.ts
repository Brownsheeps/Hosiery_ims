import type { Request, Response, NextFunction } from "express";
import { AUTH_ERRORS } from "../constants/auth.constants.js";

/**
 * Middleware factory for role-based authorization.
 * Ensures the authenticated and approved user has one of the allowed roles.
 * Must be used AFTER authentication and approval middlewares.
 *
 * @param allowedRoles - Spread array of roles permitted to access the route.
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // 1. Verify req.user exists
    if (!req.user) {
      res.status(401).json({ error: AUTH_ERRORS.USER_NOT_FOUND });
      return;
    }

    // 2. Verify req.user.roles exists
    if (!req.user.roles) {
      res.status(403).json({ error: AUTH_ERRORS.FORBIDDEN });
      return;
    }

    // 3. Read the user's role name
    const userRole = req.user.roles.name;


    // 4. Compare it against the allowed roles passed to the middleware
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ error: AUTH_ERRORS.FORBIDDEN });
      return;
    }

    // 5. Otherwise, user is permitted
    next();
  };
};
