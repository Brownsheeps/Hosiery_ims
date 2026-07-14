import { StyleSheet, Text, View } from "react-native";

interface MovementRowProps {
  movement: {
    id: number;
    date: string;
    sku: string;
    product: string;
    movementType: string;
    quantity: number;
    reference: string;
    user: string;
  };
}

export default function MovementRow({ movement }: MovementRowProps) {
  const normalizedType = movement.movementType.toLowerCase();
  const isStockIn = normalizedType.includes("in") && !normalizedType.includes("out");
  const isStockOut = normalizedType.includes("out");

  let badgeColor = "#374151";
  let badgeLabel = movement.movementType;

  if (isStockIn) {
    badgeColor = "#16A34A";
    badgeLabel = "Stock In";
  } else if (isStockOut) {
    badgeColor = "#DC2626";
    badgeLabel = "Stock Out";
  } else if (normalizedType.includes("adjust")) {
    badgeColor = "#D97706";
    badgeLabel = "Adjustment";
  }

  return (
    <View style={styles.row}>
      <View style={styles.cell}><Text style={styles.text}>{movement.date}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{movement.sku}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{movement.product}</Text></View>
      <View style={styles.cell}>
        <View style={[styles.badge, { backgroundColor: `${badgeColor}15` }]}> 
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
        </View>
      </View>
      <View style={styles.cell}><Text style={styles.text}>{movement.quantity}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{movement.reference}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{movement.user}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  cell: {
    minWidth: 110,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  text: {
    color: "#374151",
    fontSize: 13,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
