import { useCallback, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import { documentDirectory, writeAsStringAsync, EncodingType } from "expo-file-system/legacy";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import * as XLSX from "xlsx";

import ReportCard from "@/components/reports/ReportCard";
import ReportHeader from "@/components/reports/ReportHeader";
import ReportTable from "@/components/reports/ReportTable";
import LoadingSkeleton from "@/components/reports/LoadingSkeleton";
import EmptyState from "@/components/reports/EmptyState";
import { useReports } from "@/hooks/useReports";
import { useApi } from "@/hooks/useApi";

export default function ReportsScreen() {
  const { summaryCards, movements, loading, refreshing, error, refreshReports } = useReports();
  const { request } = useApi();
  const [exportingType, setExportingType] = useState<string | null>(null);

  const onRefresh = useCallback(() => {
    void refreshReports();
  }, [refreshReports]);

  const handleExportReport = async (type: string, title: string) => {
    try {
      setExportingType(type);

      const response = await request(`/api/reports/export?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch export dataset from server.");
      }

      const json = await response.json();
      const rawData = json.data || json;

      if (!Array.isArray(rawData) || rawData.length === 0) {
        Alert.alert("No Data", "There is no recorded data to export for this report.");
        return;
      }

      let exportData: Array<Record<string, string | number>> = [];

      switch (type) {
        case "current-inventory":
          exportData = rawData.map((item: any) => ({
            "SKU": item.sku,
            "Product Name": item.product,
            "Color": item.color || "-",
            "Size": item.size || "-",
            "Purchase Price": item.purchasePrice,
            "Selling Price": item.sellingPrice,
            "Current Stock": item.stock,
          }));
          break;

        case "low-stock":
          exportData = rawData.map((item: any) => ({
            "SKU": item.sku,
            "Product Name": item.product,
            "Current Stock": item.stock,
            "Minimum Stock": item.minStock,
          }));
          break;

        case "stock-movements":
          exportData = rawData.map((item: any) => ({
            "Date": item.date ? new Date(item.date).toLocaleString() : "-",
            "SKU": item.sku,
            "Product Name": item.product,
            "Transaction Type": item.transactionType,
            "Quantity": item.quantity,
            "By whom": item.employee,
            "Remarks": item.remarks || "-",
          }));
          break;

        case "category-wise":
          exportData = rawData.map((item: any) => ({
            "Category": item.category,
            "Unique SKUs": item.skuCount,
            "Total Stock Units": item.totalUnits,
          }));
          break;
      }

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, title);
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const dateString = new Date().toISOString().slice(0, 10);
      const filename = `${type}_report_${dateString}.xlsx`;
      const fileUri = `${documentDirectory}${filename}`;

      await writeAsStringAsync(fileUri, wbout, {
        encoding: EncodingType.Base64,
      });

      const sharingAvailable = await isAvailableAsync();
      if (sharingAvailable) {
        setTimeout(async () => {
          try {
            await shareAsync(fileUri, {
              mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              dialogTitle: `Export ${title} Report Data`,
              UTI: "com.microsoft.excel.xlsx",
            });
          } catch (shareError: any) {
            console.log("Sharing interactive sheet overlay dismissed:", shareError?.message);
          }
        }, 150);
      } else {
        Alert.alert("Success", `File saved locally: ${filename}`);
      }
    } catch (err) {
      console.error("Export System Error:", err);
      Alert.alert("Export Error", "Failed to compile report sheet.");
    } finally {
      setExportingType(null);
    }
  };

  const renderedCards = useMemo(
    () =>
      summaryCards.map((card) => (
        <ReportCard
          key={card.title}
          title={card.title}
          value={card.value}
          onExport={() => void handleExportReport(card.type, card.title)}
          icon={
            exportingType === card.type ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Ionicons name="cube-outline" size={18} color="#2563EB" />
            )
          }
        />
      )),
    [summaryCards, exportingType],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
        showsVerticalScrollIndicator={false}
      >
        <ReportHeader />

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <View style={styles.errorState}>
            <Ionicons name="alert-circle-outline" size={36} color="#DC2626" />
            <Text style={styles.errorTitle}>Unable to load reports</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.retryText} onPress={() => void refreshReports()}>
              Retry
            </Text>
          </View>
        ) : (
          <>
            {renderedCards}
            <View style={styles.tableSection}>
              <Text style={styles.tableTitle}>Recent Movements (Latest 30)</Text>
              {movements.length > 0 ? <ReportTable movements={movements} /> : <EmptyState />}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  tableSection: {
    marginTop: 8,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  errorState: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  errorText: {
    marginTop: 8,
    color: "#6B7280",
    textAlign: "center",
  },
  retryText: {
    marginTop: 12,
    color: "#2563EB",
    fontWeight: "700",
  },
});
