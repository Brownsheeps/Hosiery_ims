export type ApprovalStatus = "PENDING";

export interface PendingUser {
  id: string;
  fullName: string;
  email: string;
  status: ApprovalStatus;
  createdAt: string;
}
