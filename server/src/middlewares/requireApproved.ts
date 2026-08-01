import type { Request, Response, NextFunction } from "express";
import { USER_STATUS, AUTH_ERRORS } from "../constants/auth.constants.js";

/**
 * Middleware to require the authenticated user to be APPROVED and active.
 * This MUST be utilized after the authentication middleware attaches req.user.
 */
export const requireApproved = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Verify req.user exists
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // 2. Check if user is active
  if (req.user.is_active === false) {
    res.status(403).json({ error: AUTH_ERRORS.USER_INACTIVE });
    return;
  }

  // 3. Check if user status is APPROVED
  if (req.user.status !== USER_STATUS.APPROVED) {
    res.status(403).json({ error: AUTH_ERRORS.USER_NOT_APPROVED });
    return;
  }

  // 4. Otherwise, user is active and approved
  next();
};
