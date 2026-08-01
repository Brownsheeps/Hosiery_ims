import type { PendingUser } from "@/types/approval.types";

export const mockPendingUsers: PendingUser[] = [
  {
    id: "1",
    fullName: "John Smith",
    email: "john@company.com",
    status: "PENDING",
    createdAt: "2026-07-31",
  },
  {
    id: "2",
    fullName: "Aisha Khan",
    email: "aisha@company.com",
    status: "PENDING",
    createdAt: "2026-07-30",
  },
];
