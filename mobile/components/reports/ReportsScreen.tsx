import { useCallback, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import ReportCard from "@/components/reports/ReportCard";
import ReportHeader from "@/components/reports/ReportHeader";
import ReportTable from "@/components/reports/ReportTable";
import LoadingSkeleton from "@/components/reports/LoadingSkeleton";
import EmptyState from "@/components/reports/EmptyState";
import { useReports } from "@/hooks/useReports";

export default function ReportsScreen() {
  const { summaryCards, movements, loading, refreshing, error, refreshReports } = useReports();

  const onRefresh = useCallback(() => {
    void refreshReports();
  }, [refreshReports]);

  const renderedCards = useMemo(
    () =>
      summaryCards.map((card) => (
        <ReportCard
          key={card.title}
          title={card.title}
          value={card.value}
          onExport={() => {}}
          icon={<Ionicons name="cube-outline" size={18} color="#2563EB" />}
        />
      )),
    [summaryCards],
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
