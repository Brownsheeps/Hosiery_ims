import { useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import StockInHeader from "@/components/stock/StockInHeader";
import { API_BASE_URL } from "@/constants/api";
import type { ProductSearchItem } from "@/components/stock/interface/types";

interface AdjustmentFormState {
  actualStock: string;
  remarks: string;
}

interface AdjustmentResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    quantity: number;
    variant: {
      id: number;
      sku: string;
      product: { product_name: string };
    };
  };
}

export default function StockAdjustment() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    variantId?: string;
    sku?: string;
    product?: string;
    color?: string;
    size?: string;
    currentStock?: string;
  }>();

  const initialVariant = useMemo<ProductSearchItem | null>(() => {
    if (!params.variantId || !params.sku || !params.product) {
      return null;
    }

    return {
      variantId: Number(params.variantId),
      sku: params.sku,
      productName: params.product,
      color: params.color ?? null,
      size: params.size ?? null,
      currentStock: Number(params.currentStock ?? 0),
    };
  }, [params.color, params.currentStock, params.product, params.size, params.sku, params.variantId]);

  const selectedVariant = initialVariant;
  const [form, setForm] = useState<AdjustmentFormState>({ actualStock: "", remarks: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ actualStock?: string }>({});

  const currentStock = useMemo(() => selectedVariant?.currentStock ?? Number(params.currentStock ?? 0), [params.currentStock, selectedVariant]);
  const isValid = useMemo(() => {
    const actualStockValue = Number(form.actualStock);

    return (
      !!selectedVariant &&
      form.actualStock.trim() !== "" &&
      Number.isFinite(actualStockValue) &&
      actualStockValue >= 0
    );
  }, [form.actualStock, selectedVariant]);

  function updateField(field: keyof AdjustmentFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "actualStock") {
      setErrors((current) => ({ ...current, actualStock: undefined }));
    }
  }

  function validate() {
    const nextErrors: { actualStock?: string } = {};
    const actualStockValue = Number(form.actualStock);

    if (!selectedVariant) {
      Alert.alert("Error", "Please open Stock Adjustment from an inventory item.");
      return false;
    }

    if (form.actualStock.trim() === "") {
      nextErrors.actualStock = "Actual stock is required.";
    } else if (!Number.isFinite(actualStockValue)) {
      nextErrors.actualStock = "Actual stock must be numeric.";
    } else if (actualStockValue < 0) {
      nextErrors.actualStock = "Actual stock cannot be negative.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) {
      return;
    }

    if (!selectedVariant) {
      Alert.alert("Error", "Please select a product.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId: selectedVariant.variantId,
          quantity: Number(form.actualStock),
          remarks: form.remarks.trim() || null,
        }),
      });

      const json: AdjustmentResponse = await response.json();

      if (!response.ok) {
        Alert.alert("Error", json?.message || "Unable to record stock adjustment.");
        return;
      }

      Alert.alert("Success", json.message || "Stock adjustment recorded");
      setForm({ actualStock: "", remarks: "" });
      router.replace("/(drawer)/inventory");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Network error", error.message);
      } else {
        Alert.alert("Network error", "Unable to record stock adjustment");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StockInHeader title="Stock Adjustment" subtitle="Record a stock count adjustment" />

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>SKU</Text>
          <Text style={styles.value}>{selectedVariant?.sku ?? params.sku ?? "-"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Product</Text>
          <Text style={styles.value}>{selectedVariant?.productName ?? params.product ?? "-"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Color</Text>
          <Text style={styles.value}>{(selectedVariant?.color ?? params.color) || "-"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Size</Text>
          <Text style={styles.value}>{(selectedVariant?.size ?? params.size )|| "-"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Current Stock</Text>
          <Text style={styles.value}>{Number.isFinite(currentStock) ? currentStock : "-"}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Actual Stock</Text>
          <TextInput
            value={form.actualStock}
            onChangeText={(value) => updateField("actualStock", value)}
            placeholder="Enter actual stock"
            keyboardType="numeric"
            style={styles.input}
          />
          {errors.actualStock ? <Text style={styles.errorText}>{errors.actualStock}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            value={form.remarks}
            onChangeText={(value) => updateField("remarks", value)}
            placeholder="Add remarks"
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />
        </View>

        <Pressable style={[styles.button, (!isValid || loading) && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading || !isValid}>
          <Text style={styles.buttonText}>{loading ? "Saving..." : "Save Adjustment"}</Text>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  inputGroup: {
    gap: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    minHeight: 100,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
  },
});
