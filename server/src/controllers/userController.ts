import type { Request, Response } from "express";
import {
    getPendingUsersService,
    approveUserService,
    rejectUserService,
} from "../services/userService.js";

export async function getPendingUsers(
    req: Request,
    res: Response
) {
    const users = await getPendingUsersService();

    return res.status(200).json({
        success: true,
        data: users,
    });
}

export async function approveUser(
    req: Request,
    res: Response
) {
    const { id } = req.params;
    const { roleId } = req.body;

    const user = await approveUserService(id, roleId);

    return res.status(200).json({
        success: true,
        message: "User approved successfully.",
        data: user,
    });
}

export async function rejectUser(
    req: Request,
    res: Response
) {
    const { id } = req.params;

    const user = await rejectUserService(id);

    return res.status(200).json({
        success: true,
        message: "User rejected successfully.",
        data: user,
    });
}