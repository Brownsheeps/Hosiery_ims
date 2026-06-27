import { StyleSheet, Text, View } from "react-native";

export interface LowStockProduct {
  id: number;
  sku: string;
  itemName: string;
  currentStock: number;
  minStock: number;
}

interface LowStockItemProps {
  product: LowStockProduct;
}

export default function LowStockItem({ product }: LowStockItemProps) {
  const stockColor = getStockColor(product.currentStock, product.minStock);
  const stockText = `${product.currentStock} / ${product.minStock}`;

  return (
    <View style={styles.row}>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{product.itemName}</Text>
        <Text style={styles.skuText}>{product.sku}</Text>
      </View>

      <Text style={[styles.stockText, { color: stockColor }]}>
        {stockText}
      </Text>
    </View>
  );
}

function getStockColor(currentStock: number, minStock: number) {
  if (currentStock === 0) {
    return "#DC2626";
  }

  if (currentStock < minStock) {
    return "#D97706";
  }

  if (currentStock === minStock) {
    return "#CA8A04";
  }

  return "#16A34A";
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  nameText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  skuText: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  stockText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
