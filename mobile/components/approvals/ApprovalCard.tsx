import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PendingUser } from "@/types/approval.types";

interface ApprovalCardProps {
  user: PendingUser;
  onApprove: (user: PendingUser) => void;
  onReject: (user: PendingUser) => void;
}

function formatJoinedDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ApprovalCard({ user, onApprove, onReject }: ApprovalCardProps) {
  const initials = user.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>{user.fullName}</Text>
          <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Pending</Text>
        </View>
      </View>

      <Text style={styles.joinedDate}>Joined: {formatJoinedDate(user.createdAt)}</Text>

      <View style={styles.roleSection}>
        <Text style={styles.fieldLabel}>Role</Text>
        <View style={styles.roleSelector} pointerEvents="none">
          <Text style={styles.rolePlaceholder}>Select Role</Text>
          <View style={styles.roleValue}>
            <Text style={styles.roleValueText}>Employee</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.rejectButton} onPress={() => onReject(user)}>
          <Text style={styles.rejectText}>Reject</Text>
        </Pressable>
        <Pressable style={styles.approveButton} onPress={() => onApprove(user)}>
          <Text style={styles.approveText}>Approve</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBEAFE",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  email: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B45309",
  },
  joinedDate: {
    marginTop: 14,
    fontSize: 13,
    color: "#6B7280",
  },
  roleSection: {
    marginTop: 14,
  },
  fieldLabel: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  roleSelector: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
  },
  rolePlaceholder: {
    flex: 1,
    fontSize: 14,
    color: "#9CA3AF",
  },
  roleValue: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    backgroundColor: "#E5E7EB",
  },
  roleValueText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  actions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  rejectText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  approveButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },
  approveText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
