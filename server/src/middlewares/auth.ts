import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { AUTH_ERRORS } from "../constants/auth.constants.js";
import prisma from "../utils/db.js";

/**
 * Authentication middleware that verifies the Clerk JWT and attaches the user to the request.
 * It ONLY authenticates the user and does NOT perform any authorization checks.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Read the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: AUTH_ERRORS.NO_TOKEN });
      return;
    }

    // 2. Validate the Bearer token format
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: AUTH_ERRORS.NO_TOKEN });
      return;
    }

    // 3. Verify the Clerk JWT using the official Clerk backend SDK
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error("CLERK_SECRET_KEY is required in environment variables.");
    }

    const decoded = await verifyToken(token, {
      secretKey: secretKey,
    });

    if (!decoded || !decoded.sub) {
      res.status(401).json({ error: AUTH_ERRORS.INVALID_TOKEN });
      return;
    }

    // 4. Extract the Clerk user id
    const clerkId = decoded.sub;

    // 5. Query Prisma using clerk_id and include the related role
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      include: {
        roles: true,
      },
    });

    // 6. If no database user exists, return 401 USER_NOT_FOUND
    if (!user) {
      res.status(401).json({ error: AUTH_ERRORS.USER_NOT_FOUND });
      return;
    }

    // 7. Attach the database user onto req.user
    req.user = user;

    // 8. Call next()
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ error: AUTH_ERRORS.INVALID_TOKEN });
  }
};
