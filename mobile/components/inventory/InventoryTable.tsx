import { ScrollView, StyleSheet, Text, View } from "react-native";

import EmptyInventory from "./EmptyInventory";
import InventoryRow, { type InventoryItemRow } from "./InventoryRow";
import LoadingInventory from "./LoadingInventory";

interface InventoryTableProps {
  items: InventoryItemRow[];
  loading: boolean;
}

export default function InventoryTable({ items, loading }: InventoryTableProps) {
  if (loading) {
    return <LoadingInventory />;
  }

  if (items.length === 0) {
    return <EmptyInventory />;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>SKU</Text>
            <Text style={styles.headerCell}>PRODUCT</Text>
            <Text style={styles.headerCell}>MODEL</Text>
            <Text style={styles.headerCell}>COLOR</Text>
            <Text style={styles.headerCell}>SIZE</Text>
            <Text style={styles.headerCell}>PURCHASE</Text>
            <Text style={styles.headerCell}>SELLING</Text>
            <Text style={styles.headerCell}>STOCK</Text>
          </View>

          <ScrollView style={styles.bodyScroll} nestedScrollEnabled>
            {items.map((item) => (
              <InventoryRow key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  table: {
    minWidth: 900,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerCell: {
    flex: 1,
    minWidth: 110,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    paddingRight: 8,
  },
  bodyScroll: {
    maxHeight: 420,
  },
});
