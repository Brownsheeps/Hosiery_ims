import { StyleSheet, Text } from "react-native";

interface StockBadgeProps {
  stock: number;
  minStock?: number;
}

export default function StockBadge({ stock, minStock }: StockBadgeProps) {
  const color = getStockColor(stock, minStock);

  return (
    <Text style={[styles.badge, { backgroundColor: color.background }, { color: color.text }]}>
      {stock}
    </Text>
  );
}

function getStockColor(stock: number, minStock?: number) {
  if (stock === 0) {
    return { background: "#FEE2E2", text: "#DC2626" };
  }

  if (minStock !== undefined && stock <= minStock) {
    return { background: "#FEF3C7", text: "#D97706" };
  }

  return { background: "#DCFCE7", text: "#16A34A" };
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 44,
    textAlign: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: "700",
    overflow: "hidden",
  },
});
