import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import StockInHeader from "@/components/stock/StockInHeader";
import ProductInformation from "@/components/add-product/ProductInformation";
import VariantList from "@/components/add-product/VariantList";
import type { MetaOption, ProductDetails, ProductMetadata, ProductVariant } from "@/components/add-product/types";
import { API_BASE_URL } from "@/constants/api";
import { fetchWithSingleRetry } from "@/lib/fetch-with-single-retry";

const emptyProduct: ProductDetails = {
  name: "", category: null, brand: null, supplier: null, description: "",
};

const emptyMetadata: ProductMetadata = {
  categories: [], brands: [], suppliers: [], colours: [], sizes: [],
};

interface CreateProductResponse {
  message?: string;
  data: {
    productSku: string;
    variants: Array<{
      variantSku: string;
    }>;
  };
}

const createVariant = (): ProductVariant => ({
  id: `v-${Date.now()}-${Math.random()}`,
  colour: null, size: null,
  openingStock: "", purchasePrice: "", sellingPrice: "", minStock: "",
});

function buildBody(product: ProductDetails, variants: ProductVariant[]) {
  return {
    product: {
      name: product.name.trim(),
      description: product.description.trim() || undefined,
      categoryId: product.category?.isNew ? null : (product.category?.id ?? null),
      newCategory: product.category?.isNew ? product.category.name : null,
      brandId: product.brand?.isNew ? null : (product.brand?.id ?? null),
      newBrand: product.brand?.isNew ? product.brand.name : null,
      newBrandCode: product.brand?.isNew ? (product.brand.brandCode ?? null) : null,
      supplierId: product.supplier?.isNew ? null : (product.supplier?.id ?? null),
      newSupplier: product.supplier?.isNew ? product.supplier.name : null,
    },
    variants: variants.map((v) => ({
      colourId: v.colour?.isNew ? null : (v.colour?.id ?? null),
      newColour: v.colour?.isNew ? v.colour.name : null,
      newColourCode: v.colour?.isNew ? (v.colour.colourCode ?? null) : null,
      sizeId: v.size?.isNew ? null : (v.size?.id ?? null),
      newSize: v.size?.isNew ? v.size.name : null,
      newSizeCode: v.size?.isNew ? (v.size.sizeCode ?? null) : null,
      openingStock: parseInt(v.openingStock || "0", 10),
      purchasePrice: parseFloat(v.purchasePrice || "0"),
      sellingPrice: parseFloat(v.sellingPrice || "0"),
      minStock: parseInt(v.minStock || "0", 10),
    })),
  };
}

export default function AddProductScreen() {

  const [metadata, setMetadata] = useState<ProductMetadata>(emptyMetadata);
  const [metaLoading, setMetaLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetails>(emptyProduct);
  const [variants, setVariants] = useState<ProductVariant[]>(() => [createVariant()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {

    fetch(`${API_BASE_URL}/api/products/metadata`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setMetadata({
            categories: json.data.categories,
            brands: json.data.brands.map((b: any) => ({ id: b.id, name: b.name, brandCode: b.brandCode })),
            suppliers: json.data.suppliers,
            colours: json.data.colours.map((c: any) => ({ id: c.id, name: c.name, colourCode: c.colourCode })),
            sizes: json.data.sizes.map((s: any) => ({ id: s.id, name: s.name, sizeCode: s.sizeCode })),
          });
        }
      })
      .catch(() => Alert.alert("Error", "Could not load product metadata"))
      .finally(() => setMetaLoading(false));
  }, []);

  const addOption = useCallback((field: keyof ProductMetadata, option: MetaOption) => {
    setMetadata((prev) => {
      const exists = prev[field].some((o) => o.name.toLowerCase() === option.name.toLowerCase());
      return exists ? prev : { ...prev, [field]: [...prev[field], option] };
    });
  }, []);

  const addVariant = useCallback(() => setVariants((c) => [...c, createVariant()]), []);
  const updateVariant = useCallback((id: string, next: ProductVariant) => setVariants((c) => c.map((v) => v.id === id ? next : v)), []);
  const deleteVariant = useCallback((id: string) => setVariants((c) => c.length === 1 ? c : c.filter((v) => v.id !== id)), []);
  const resetForm = useCallback(() => { setProduct(emptyProduct); setVariants([createVariant()]); }, []);

  async function saveProduct() {

    if (!product.name.trim()) return Alert.alert("Validation", "Product name is required");
    if (!product.category) return Alert.alert("Validation", "Category is required");
    if (!product.brand) return Alert.alert("Validation", "Brand is required");
    if (!product.supplier) return Alert.alert("Validation", "Supplier is required");

    for (const v of variants) {
      if (!v.colour) return Alert.alert("Validation", "Every variant must have a colour");
      if (!v.size) return Alert.alert("Validation", "Every variant must have a size");
    }

    setSaving(true);

    try {
      const { response: res, json } = await fetchWithSingleRetry<CreateProductResponse>(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildBody(product, variants)),
      });

      if (!res.ok) return Alert.alert("Error", json.message ?? "Failed to save product");

      const skus = json.data.variants.map((v: any) => v.variantSku).join("\n");
      Alert.alert("Product Created", `SKU: ${json.data.productSku}\n\nVariants:\n${skus}`);
      resetForm();
    } catch {
      Alert.alert("Error", "Network error. Please try again.");

    } finally {
      setSaving(false);
    }
  }

  if (metaLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <StockInHeader title="Add Product" subtitle="SKU will be generated automatically" />
        <ProductInformation value={product} metadata={metadata} onChange={setProduct} onAddOption={addOption} />
        <VariantList variants={variants} metadata={metadata} onChange={updateVariant} onAdd={addVariant} onDelete={deleteVariant} onAddOption={addOption} />
        <View style={styles.actions}>
          <Pressable style={styles.cancelButton} onPress={resetForm} disabled={saving}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.saveButton, saving && styles.disabled]} onPress={saveProduct} disabled={saving}>
            {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveText}>Save Product</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { color: "#475569", fontSize: 14 },
  content: { padding: 20, paddingBottom: 40 },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelButton: { flex: 1, minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#FFFFFF" }, cancelText: { color: "#475569", fontWeight: "700", fontSize: 15 },
  saveButton: { flex: 1, minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: "#2563EB" }, saveText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  disabled: { opacity: 0.6 },
});
