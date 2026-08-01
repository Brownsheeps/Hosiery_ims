import { StyleSheet, Text, View } from "react-native";

interface InvoiceSummaryProps {
  subtotal: number;
  grandTotal: number;
}

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function InvoiceSummary({ subtotal, grandTotal }: InvoiceSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Grand Total</Text>
        <Text style={styles.value}>{formatCurrency(grandTotal)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "700",
  },
});
