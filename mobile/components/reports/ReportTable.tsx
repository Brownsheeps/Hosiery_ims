import { ScrollView, StyleSheet, Text, View } from "react-native";

import MovementRow from "@/components/reports/MovementRow";

interface ReportTableProps {
  movements: Array<{
    id: number;
    date: string;
    sku: string;
    product: string;
    movementType: string;
    quantity: number;
    reference: string;
    user: string;
  }>;
}

export default function ReportTable({ movements }: ReportTableProps) {
  const headers = ["Date", "SKU", "Item", "Type", "Quantity", "User", "Remarks"];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableContent}>
          <View style={styles.headerRow}>
            {headers.map((header) => (
              <View key={header} style={[styles.headerCell, getHeaderWidth(header)]}>
                <Text style={styles.headerText}>{header}</Text>
              </View>
            ))}
          </View>

          {movements.map((movement) => (
            <MovementRow key={movement.id} movement={movement} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function getHeaderWidth(header: string) {
  switch (header) {
    case "Date":
      return { minWidth: 110 };
    case "SKU":
      return { minWidth: 110 };
    case "Item":
      return { minWidth: 170 };
    case "Type":
      return { minWidth: 100 };
    case "Quantity":
      return { minWidth: 90 };
    case "User":
      return { minWidth: 120 };
    case "Remarks":
      return { minWidth: 180 };
    default:
      return { minWidth: 120 };
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: "hidden",
  },
  tableContent: {
    minWidth: 900,
  },
  headerRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerCell: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
});
