import { useCallback, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import StockInHeader from "@/components/stock/StockInHeader";
import ProductInformation from "@/components/add-product/ProductInformation";
import VariantList from "@/components/add-product/VariantList";
import type { ProductDetails, ProductVariant } from "@/components/add-product/types";

const emptyProduct: ProductDetails = { name: "", sku: "", category: "", brand: "", supplier: "", description: "" };
const createVariant = (): ProductVariant => ({ id: `variant-${Date.now()}-${Math.random()}`, colour: "", size: "", openingStock: "", purchasePrice: "", sellingPrice: "", sku: "" });

export default function AddProductScreen() {
  const [product, setProduct] = useState<ProductDetails>(emptyProduct);
  const [variants, setVariants] = useState<ProductVariant[]>(() => [createVariant()]);
  const addVariant = useCallback(() => setVariants((current) => [...current, createVariant()]), []);
  const updateVariant = useCallback((id: string, nextValue: ProductVariant) => setVariants((current) => current.map((variant) => variant.id === id ? nextValue : variant)), []);
  const deleteVariant = useCallback((id: string) => setVariants((current) => current.length === 1 ? current : current.filter((variant) => variant.id !== id)), []);
  const resetForm = useCallback(() => { setProduct(emptyProduct); setVariants([createVariant()]); }, []);

  return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
    <StockInHeader title="Add Product" subtitle="Create a product and its variants" />
    <ProductInformation value={product} onChange={setProduct} />
    <VariantList variants={variants} onChange={updateVariant} onAdd={addVariant} onDelete={deleteVariant} />
    <View style={styles.actions}><Pressable style={styles.cancelButton} onPress={resetForm}><Text style={styles.cancelText}>Cancel</Text></Pressable><Pressable style={styles.saveButton} onPress={() => {}}><Text style={styles.saveText}>Save Product</Text></Pressable></View>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" }, content: { padding: 20, paddingBottom: 40 }, actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelButton: { flex: 1, minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#FFFFFF" }, cancelText: { color: "#475569", fontWeight: "700", fontSize: 15 },
  saveButton: { flex: 1, minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: "#2563EB" }, saveText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
