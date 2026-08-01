import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { documentDirectory, writeAsStringAsync, EncodingType } from "expo-file-system/legacy";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import * as XLSX from "xlsx";

import InventoryHeader from "@/components/inventory/InventoryHeader";
import { useApi } from "@/hooks/useApi";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryToolbar from "@/components/inventory/InventoryToolbar";
import { type CategoryOption } from "@/components/inventory/CategoryFilter";

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

const PAGE_SIZE = 20;

export default function Inventory() {
  const router = useRouter();
  const { request } = useApi();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allItems, setAllItems] = useState<InventoryApiResponse["data"]["items"]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);

      const allFetchedItems: InventoryApiResponse["data"]["items"] = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await request(`/api/inventory?page=${currentPage}&pageSize=100`);
        if (!response.ok) {
          throw new Error("Unable to fetch inventory.");
        }

        const json: InventoryApiResponse = await response.json();
        allFetchedItems.push(...json.data.items);
        totalPages = json.data.pagination.totalPages || 0;
        currentPage += 1;
      }

      setAllItems(allFetchedItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void fetchInventory();
  }, [fetchInventory]);

  useFocusEffect(
    useCallback(() => {
      void fetchInventory();
    }, [fetchInventory]),
  );

  const categories = useMemo<CategoryOption[]>(() => {
    const uniqueProducts = Array.from(new Set(allItems.map((item) => item.product).filter(Boolean)));

    return [
      { id: "all", label: "All Categories", value: "all" },
      ...uniqueProducts.map((product) => ({
        id: product,
        label: product,
        value: product.toLowerCase(),
      })),
    ];
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return allItems.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [item.sku, item.product, item.color, item.size]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));

      const matchesCategory =
        selectedCategory === "all" ||
        item.product.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [allItems, searchValue, selectedCategory]);

  const pagination = useMemo(() => {
    const totalItems = filteredItems.length;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / PAGE_SIZE);

    return {
      page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    };
  }, [filteredItems.length, page]);

  const visibleItems = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredItems, page]);

  const pageLabel = useMemo(() => {
    if (pagination.totalPages === 0) {
      return "Page 0 of 0";
    }

    return `Page ${pagination.page} of ${pagination.totalPages}`;
  }, [pagination.page, pagination.totalPages]);

  function handleSearchChange(text: string) {
    setSearchValue(text);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setSelectedCategory(value);
    setPage(1);
  }

  const handleExport = async () => {
    if (filteredItems.length === 0) {
      Alert.alert("No Data", "There is no data available to export.");
      return;
    }

    try {
      setExporting(true);

      const exportData = filteredItems.map((item) => ({
        "SKU": item.sku,
        "Product Name": item.product,
        "Color": item.color || "-",
        "Size": item.size || "-",
        "Purchase Price": item.purchasePrice || 0,
        "Selling Price": item.sellingPrice || 0,
        "Stock Qty": item.stock,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Filtered Inventory");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const dateString = new Date().toISOString().slice(0, 10);
      const filename = `inventory_${selectedCategory}_${dateString}.xlsx`;
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
              dialogTitle: "Export Inventory Sheet Data",
              UTI: "com.microsoft.excel.xlsx",
            });
          } catch (shareError: any) {
            console.log("Sharing window closed or dismissed by user:", shareError?.message);
          }
        }, 150);
      } else {
        Alert.alert("Success", `File saved successfully to device: ${filename}`);
      }
    } catch (error) {
      console.error("Export Error:", error);
      Alert.alert("Export Failed", "An error occurred while generating Excel sheet.");
    } finally {
      setExporting(false);
    }
  };

  function handleAdjustItem(item: InventoryApiResponse["data"]["items"][number]) {
    router.push({
      pathname: "/(drawer)/stock-adjustment" as never,
      params: {
        variantId: String(item.id),
        sku: item.sku,
        product: item.product,
        color: item.color ?? "",
        size: item.size ?? "",
        currentStock: String(item.stock),
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <InventoryHeader 
        totalItems={pagination.totalItems} 
        totalCount={allItems.length} 
        onExport={handleExport}
      />
      <InventoryToolbar
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <InventoryTable items={visibleItems} loading={loading || exporting} onAdjust={handleAdjustItem} />

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


  containerInventoryHeader: {
    gap: 50,
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
