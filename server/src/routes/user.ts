import { Router } from "express";
import {
    getPendingUsers,
    approveUser,
    rejectUser,
} from "../controllers/user.controller.js";

const router = Router();

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