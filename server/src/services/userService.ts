import prisma from "../utils/db.js";

export async function getPendingUsersService() {
    return prisma.users.findMany({
        where: {
            status: "PENDING",
        },
        orderBy: {
            created_at: "desc",
        },
        select: {
            id: true,
            full_name: true,
            email: true,
            status: true,
            created_at: true,
        },
    });
}

export async function approveUserService(
    id: string,
    roleId: number
) {
    return prisma.users.update({
        where: {
            id,
        },
        data: {
            status: "APPROVED",
            role_id: roleId,
        },
        select: {
            id: true,
            full_name: true,
            email: true,
            status: true,
            role_id: true,
        },
    });
}

export async function rejectUserService(
    id: string
) {
    return prisma.users.update({
        where: {
            id,
        },
        data: {
            status: "REJECTED",
        },
        select: {
            id: true,
            full_name: true,
            email: true,
            status: true,
        },
    });
}