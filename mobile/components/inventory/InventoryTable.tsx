import { ScrollView, StyleSheet, Text, View } from "react-native";

import EmptyInventory from "./EmptyInventory";
import InventoryRow, { type InventoryItemRow } from "./InventoryRow";
import LoadingInventory from "./LoadingInventory";

interface InventoryTableProps {
  items: InventoryItemRow[];
  loading: boolean;
  onAdjust?: (item: InventoryItemRow) => void;
}

export default function InventoryTable({ items, loading, onAdjust }: InventoryTableProps) {
  if (loading) {
    return <LoadingInventory />;
  }

  if (items.length === 0) {
    return <EmptyInventory />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalScrollContent}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>SKU</Text>
            <Text style={styles.headerCell}>PRODUCT</Text>
            <Text style={styles.headerCell}>COLOR</Text>
            <Text style={styles.headerCell}>SIZE</Text>
            <Text style={styles.headerCell}>PURCHASE</Text>
            <Text style={styles.headerCell}>SELLING</Text>
            <Text style={styles.headerCell}>STOCK</Text>
            <Text style={styles.headerActionCell}>ACTION</Text>
          </View>

          <ScrollView style={styles.bodyScroll} nestedScrollEnabled>
            {items.map((item) => (
              <InventoryRow key={item.id} item={item} onAdjust={onAdjust} />
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
    minWidth: 1080,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerCell: {
    width: 140,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    paddingRight: 8,
  },
  headerActionCell: {
    width: 100,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    textAlign: "center",
  },
  bodyScroll: {
    flex: 1,
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalScrollContent: {
    flexGrow: 1,
  },
});
