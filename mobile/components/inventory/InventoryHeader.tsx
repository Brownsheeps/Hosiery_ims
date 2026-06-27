import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface InventoryHeaderProps {
  totalItems: number;
  totalCount: number;
  onExport?: () => void;
}

export default function InventoryHeader({
  totalItems,
  totalCount,
  onExport,
}: InventoryHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={28} color="#111827" />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>{totalItems} of {totalCount} SKUs</Text>
      </View>

      <Pressable onPress={onExport} style={styles.exportButton}>
        <Ionicons name="download-outline" size={16} color="#2563EB" />
        <Text style={styles.exportText}>Export</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  menuButton: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#EFF6FF",
  },
  exportText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },
});
