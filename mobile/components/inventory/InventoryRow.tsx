import { StyleSheet, Text, View } from "react-native";

import StockBadge from "./StockBadge";

export interface InventoryItemRow {
  id: number;
  sku: string;
  product: string;
  color: string | null;
  size: string | null;
  purchasePrice: number | null;
  sellingPrice: number | null;
  stock: number;
}

interface InventoryRowProps {
  item: InventoryItemRow;
}

export default function InventoryRow({ item }: InventoryRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.sku}</Text>
      <Text style={styles.cell}>{item.product}</Text>
      <Text style={styles.cell}>{item.product}</Text>
      <Text style={styles.cell}>{item.color ?? "-"}</Text>
      <Text style={styles.cell}>{item.size ?? "-"}</Text>
      <Text style={styles.cell}>{formatCurrency(item.purchasePrice)}</Text>
      <Text style={styles.cell}>{formatCurrency(item.sellingPrice)}</Text>
      <StockBadge stock={item.stock} />
    </View>
  );
}

function formatCurrency(value: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return `$${value.toFixed(2)}`;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    minHeight: 48,
  },
  cell: {
    flex: 1,
    minWidth: 110,
    fontSize: 13,
    color: "#374151",
    paddingRight: 8,
  },
});
