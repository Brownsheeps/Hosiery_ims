import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import InventoryHeader from "@/components/inventory/InventoryHeader";
import { API_BASE_URL } from "@/constants/api";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryToolbar from "@/components/inventory/InventoryToolbar";

interface InventoryApiResponse {
  success: boolean;
  message: string;
  data: {
    items: Array<{
      id: number;
      sku: string;
      product: string;
      color: string | null;
      size: string | null;
      purchasePrice: number | null;
      sellingPrice: number | null;
      stock: number;
    }>;
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

export default function Inventory() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState<InventoryApiResponse["data"]["items"]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchInventory();
  }, [page]);

  async function fetchInventory() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/inventory?page=${page}&pageSize=20`);
      const json: InventoryApiResponse = await response.json();
      setItems(json.data.items);
      setPagination(json.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const pageLabel = useMemo(() => {
    if (pagination.totalPages === 0) {
      return "Page 0 of 0";
    }

    return `Page ${pagination.page} of ${pagination.totalPages}`;
  }, [pagination.page, pagination.totalPages]);

  return (
    <SafeAreaView style={styles.container}>
      <InventoryHeader totalItems={pagination.totalItems} totalCount={pagination.totalItems} onExport={() => {}} />
      <InventoryToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <InventoryTable items={items} loading={loading} />

      <View style={styles.paginationRow}>
        <Pressable
          style={[styles.paginationButton, page <= 1 && styles.paginationButtonDisabled]}
          onPress={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page <= 1}
        >
          <Text style={[styles.paginationText, page <= 1 && styles.paginationTextDisabled]}>Previous</Text>
        </Pressable>

        <Text style={styles.paginationLabel}>{pageLabel}</Text>

        <Pressable
          style={[styles.paginationButton, page >= pagination.totalPages && styles.paginationButtonDisabled]}
          onPress={() => setPage((current) => current + 1)}
          disabled={page >= pagination.totalPages}
        >
          <Text style={[styles.paginationText, page >= pagination.totalPages && styles.paginationTextDisabled]}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  paginationButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },
  paginationButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  paginationText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  paginationTextDisabled: {
    color: "#9CA3AF",
  },
  paginationLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
});