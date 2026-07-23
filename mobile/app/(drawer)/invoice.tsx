import { useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { generateInvoiceHtml } from "@/components/invoice/invoiceTemplate";
import { exportPdf } from "@/constants/pdfService";

import InvoiceRow, { type InvoiceProductOption, type InvoiceRowData } from "@/components/invoice/InvoiceRow";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";

function createEmptyRow(id: string): InvoiceRowData {
  return { id, product: null, rate: 0, quantity: 1, total: 0 };
}

export default function InvoiceScreen() {
  const [rows, setRows] = useState<InvoiceRowData[]>([]);
  const totals = useMemo(() => {
    const subtotal = rows.reduce((sum, row) => sum + row.total, 0);
    return { subtotal, grandTotal: subtotal };
  }, [rows]);

  function handleSelectProduct(rowId: string, product: InvoiceProductOption | null) {
    setRows((currentRows) => currentRows.map((row) => {
      if (row.id !== rowId) return row;
      const rate = product?.sellingPrice ?? 0;
      return { ...row, product, rate, total: rate * row.quantity };
    }));
  }

  function handleQuantityChange(rowId: string, quantity: number) {
    setRows((currentRows) => currentRows.map((row) =>
      row.id === rowId ? { ...row, quantity, total: row.rate * quantity } : row,
    ));
  }

  async function handleExportPdf() {
  if (rows.length === 0) {
    Alert.alert("No Products", "Please add products first.");
    return;
  }

  try {
    const html = generateInvoiceHtml({
      rows,
      grandTotal: totals.grandTotal,
    });

    await exportPdf(html);

  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Unable to export invoice.");
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}><Text style={styles.title}>Invoice</Text></View>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Item</Text><Text style={styles.headerCell}>Rate</Text>
          <Text style={styles.headerCell}>Quantity</Text><Text style={styles.headerCell}>Total</Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => setRows((current) => [...current, createEmptyRow(`row-${Date.now()}-${Math.random()}`)])}>
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" /><Text style={styles.addButtonText}>Add Product</Text>
        </Pressable>
        {rows.map((row) => (
          <InvoiceRow key={row.id} item={row} onSelectProduct={(product) => handleSelectProduct(row.id, product)} onQuantityChange={(quantity) => handleQuantityChange(row.id, quantity)} onRemove={() => setRows((current) => current.filter((item) => item.id !== row.id))} />
        ))}
        {rows.length > 0 ? <View style={styles.actionsSection}>
          <InvoiceSummary subtotal={totals.subtotal} grandTotal={totals.grandTotal} />
          <Pressable style={styles.exportButton} onPress={handleExportPdf}><Text style={styles.exportButtonText}>Export PDF</Text></Pressable>
        </View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" }, content: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 16 }, title: { fontSize: 28, fontWeight: "700", color: "#0F172A" },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 6, marginBottom: 12 },
  headerCell: { flex: 1, fontSize: 12, fontWeight: "700", color: "#64748B", textAlign: "center" },
  addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#2563EB", borderRadius: 12, paddingVertical: 12, marginBottom: 16, gap: 8 },
  addButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" }, actionsSection: { gap: 12, marginTop: 8 },
  exportButton: { backgroundColor: "#0F172A", paddingVertical: 14, borderRadius: 12, alignItems: "center" }, exportButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
