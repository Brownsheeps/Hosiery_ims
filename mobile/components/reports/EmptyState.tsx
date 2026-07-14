import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="document-text-outline" size={40} color="#9CA3AF" />
      <Text style={styles.title}>No recent movements found</Text>
      <Text style={styles.subtitle}>Stock activity will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 14,
  },
});
