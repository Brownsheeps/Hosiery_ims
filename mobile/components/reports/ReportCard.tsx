import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReportCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  onExport?: () => void;
}

export default function ReportCard({ title, value, icon, onExport }: ReportCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>

      <View style={styles.actionWrapper}>
        <View style={styles.exportButton}>
          <Ionicons name="download-outline" size={16} color="#2563EB" />
          <Text style={styles.exportText} onPress={onExport}>
            Export
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 13,
    color: "#6B7280",
  },
  value: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  actionWrapper: {
    alignSelf: "flex-start",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#EFF6FF",
    shadowColor: "#93C5FD",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  exportText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
});
