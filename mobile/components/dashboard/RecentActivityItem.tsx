import { StyleSheet, Text, View } from "react-native";

export interface RecentTransaction {
  id: number;
  productName: string;
  sku: string;
  transactionType: string;
  quantity: number;
  employeeName: string;
  createdAt: string;
}

interface RecentActivityItemProps {
  transaction: RecentTransaction;
}

export default function RecentActivityItem({
  transaction,
}: RecentActivityItemProps) {
  const normalizedType = transaction.transactionType.toLowerCase();
  const isStockIn = normalizedType.includes("in") && !normalizedType.includes("out");
  const isStockOut = normalizedType.includes("out");
  const sign = isStockOut ? "-" : isStockIn ? "+" : "";
  const quantityText = `${sign}${Math.abs(transaction.quantity)}`;
  const quantityColor = isStockOut ? "#DC2626" : isStockIn ? "#16A34A" : "#111827";
  const relativeTime = formatRelativeTime(transaction.createdAt);

  return (
    <View style={styles.row}>
      <View style={styles.infoContainer}>
        <Text style={styles.productText}>
          {transaction.productName} ({transaction.sku})
        </Text>
        <Text style={styles.metaText}>
          {transaction.employeeName} • {relativeTime}
        </Text>
      </View>

      <Text style={[styles.quantityText, { color: quantityColor }]}> 
        {quantityText}
      </Text>
    </View>
  );
}

function formatRelativeTime(createdAt: string) {
  const createdDate = new Date(createdAt);
  const diffInSeconds = Math.floor((Date.now() - createdDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} mins ago`;
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  }

  if (diffInSeconds < 172800) {
    return "Yesterday";
  }

  const days = Math.floor(diffInSeconds / 86400);
  return `${days} days ago`;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  productText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  metaText: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  quantityText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
