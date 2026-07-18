import { Pressable, StyleSheet, Text, View } from "react-native";

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
  onAdjust?: (item: InventoryItemRow) => void;
}

export default function InventoryRow({ item, onAdjust }: InventoryRowProps) {
  return (
    <View style={styles.row}>
      <Text
  style={styles.cell}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  {item.sku}
</Text>
      <Text
  style={styles.cell}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  {item.product}
</Text>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
        {item.color ?? "-"}
      </Text>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
        {item.size ?? "-"}
      </Text>
      <Text style={styles.cell}>{formatCurrency(item.purchasePrice)}</Text>
      <Text style={styles.cell}>{formatCurrency(item.sellingPrice)}</Text>
      <StockBadge stock={item.stock} />
      <View style={styles.actionCell}>
        <Pressable style={styles.adjustButton} onPress={() => onAdjust?.(item)}>
          <Text style={styles.adjustButtonText}>Adjust</Text>
        </Pressable>
      </View>
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
    width: 140,
    fontSize: 13,
    color: "#374151",
    paddingRight: 8,
  },
  actionCell: {
    width: 100,
    alignItems: "center",
  },
  adjustButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  adjustButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
