import { Router } from "express";
import {
    getPendingUsers,
    approveUser,
    rejectUser,
    getMe,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireApproved } from "../middlewares/requireApproved.js";
import { authorize } from "../middlewares/authorize.js";
import { USER_ROLE } from "../constants/auth.constants.js";

const router = Router();

// /me endpoint for retrieving current user profile (Unrestricted other than being authenticated)
router.get("/me", authMiddleware, getMe);

// Restrict all other user routes to ADMIN only
router.use(authMiddleware, requireApproved, authorize(USER_ROLE.ADMIN));

/**
 * Get all pending users
 * GET /users/pending
 */
router.get("/pending", getPendingUsers);

/**
 * Approve a user
 * PATCH /users/:id/approve
 */
router.patch("/:id/approve", approveUser);

/**
 * Reject a user
 * PATCH /users/:id/reject
 */
router.patch("/:id/reject", rejectUser);

export default router;