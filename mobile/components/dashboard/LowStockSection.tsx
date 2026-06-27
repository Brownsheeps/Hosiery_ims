import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import LowStockItem, { type LowStockProduct } from "./LowStockItem";

interface LowStockSectionProps {
  products: LowStockProduct[];
}

export default function LowStockSection({ products }: LowStockSectionProps) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Low / Out of Stock</Text>
        <Pressable onPress={() => router.push("/(drawer)/inventory")}>
          <Text style={styles.linkText}>View Inventory</Text>
        </Pressable>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No low stock products</Text>
        </View>
      ) : (
        products.map((product, index) => (
          <View key={product.id}>
            <LowStockItem product={product} />
            {index < products.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))
      )}
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
    marginTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  emptyState: {
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },
});
