import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import ProductDropdown from "@/components/stock/ProductDropdown";
import QuantityInput from "@/components/stock/QuantityInput";
import RemarksInput from "@/components/stock/RemarksInput";
import LoadingStockIn from "@/components/stock/LoadingStockIn";
import { API_BASE_URL } from "@/constants/api";
import { ProductSearchItem, StockInResponse } from "./interface/types";

export default function StockInForm() {
  const [selectedVariant, setSelectedVariant] = useState< ProductSearchItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ product?: string; quantity?: string } | null>(null);

  async function handleSubmit() {
    const nextErrors: typeof errors = {};

    if (!selectedVariant) {
      nextErrors.product = "Please select a product variant.";
    }

    if (!quantity || quantity < 1) {
      nextErrors.quantity = "Quantity must be at least 1.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors(null);
    setLoading(true);

    try {
      const payload = selectedVariant
        ? {
            variantId: selectedVariant.variantId,
            quantity,
            remarks: remarks || null,
          }
        : {

            quantity,
            remarks: remarks || null,
          };

      const payloadToSend = payload;
      console.log("[StockIn] Sending payload:", payloadToSend);

      const res = await fetch(`${API_BASE_URL}/api/stock/in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadToSend),
      });

      const json: StockInResponse = await res.json();
      console.log("[StockIn] Response status:", res.status, "ok:", res.ok, "body:", json);

      if (!res.ok) {
        const message = json?.message || "An error occurred";
        Alert.alert("Error", message);
        return;
      }

      Alert.alert("Success", json.message || "Stock in recorded");
      // clear form
      setSelectedVariant(null);
      setQuantity(1);
      setRemarks("");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Network error", error?.message || String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <ProductDropdown value={selectedVariant} onSelect={setSelectedVariant} error={errors?.product ?? null} />

      <QuantityInput value={quantity} onChange={setQuantity} error={errors?.quantity ?? null} />

      <RemarksInput value={remarks} onChange={setRemarks} />

      {loading ? (
        <LoadingStockIn />
      ) : (
        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Recording..." : "Record Stock In"}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
