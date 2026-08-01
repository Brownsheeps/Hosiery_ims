import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface EmptyApprovalStateProps {
  searchQuery?: string;
}

export default function EmptyApprovalState({ searchQuery }: EmptyApprovalStateProps) {
  const hasSearchQuery = Boolean(searchQuery?.trim());

  return (
    <View style={styles.container}>
      <Ionicons name="people-outline" size={44} color="#9CA3AF" />
      <Text style={styles.title}>
        {hasSearchQuery ? "No matching approval requests." : "No pending approval requests."}
      </Text>
      <Text style={styles.subtitle}>
        {hasSearchQuery ? "Try a different employee name or email." : "New employee registrations will appear here."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
