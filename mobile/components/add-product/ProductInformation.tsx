import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FormField from "@/components/add-product/FormField";
import SelectField from "@/components/add-product/SelectField";
import type { ProductDetails } from "@/components/add-product/types";

interface ProductInformationProps { value: ProductDetails; onChange: (value: ProductDetails) => void; }

const initialCategories = ["Hosiery", "Socks", "Innerwear", "Accessories"];
const initialBrands = ["Own Brand", "Classic", "Premium", "Value"];
const initialSuppliers = ["Primary Supplier", "Local Supplier"];

export default function ProductInformation({ value, onChange }: ProductInformationProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [brands, setBrands] = useState(initialBrands);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const update = (field: keyof ProductDetails, nextValue: string) => onChange({ ...value, [field]: nextValue });
  const addOption = (setOptions: React.Dispatch<React.SetStateAction<string[]>>, option: string) => setOptions((current) => current.some((item) => item.toLowerCase() === option.toLowerCase()) ? current : [...current, option]);
  return <View style={styles.card}>
    <Text style={styles.heading}>Product Information</Text>
    <FormField label="Product Name" value={value.name} onChangeText={(text) => update("name", text)} placeholder="Enter product name" />
    <FormField label="Product SKU" value={value.sku} onChangeText={(text) => update("sku", text)} placeholder="Enter product SKU" />
    <View style={styles.row}>
      <SelectField label="Category" value={value.category} onChange={(text) => update("category", text)} onCreateOption={(option) => addOption(setCategories, option)} placeholder="Select category" options={categories} />
      <View style={styles.gap} />
      <SelectField label="Brand" value={value.brand} onChange={(text) => update("brand", text)} onCreateOption={(option) => addOption(setBrands, option)} placeholder="Select brand" options={brands} />
    </View>
    <SelectField label="Supplier" value={value.supplier} onChange={(text) => update("supplier", text)} onCreateOption={(option) => addOption(setSuppliers, option)} placeholder="Select supplier" options={suppliers} />
    <FormField label="Product Description" value={value.description} onChangeText={(text) => update("description", text)} placeholder="Add a short description" multiline />
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  heading: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 16 }, row: { flexDirection: "row" }, gap: { width: 12 },
});
