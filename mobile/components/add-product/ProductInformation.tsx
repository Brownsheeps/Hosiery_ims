import { StyleSheet, Text, View } from "react-native";
import FormField from "@/components/add-product/FormField";
import SelectField from "@/components/add-product/SelectField";
import type { MetaOption, ProductDetails, ProductMetadata } from "@/components/add-product/types";

interface Props {
  value: ProductDetails;
  metadata: ProductMetadata;
  onChange: (value: ProductDetails) => void;
  onAddOption: (field: "categories" | "brands" | "suppliers", option: MetaOption) => void;
}

export default function ProductInformation({ value, metadata, onChange, onAddOption }: Props) {
  const update = (field: keyof ProductDetails, next: unknown) => onChange({ ...value, [field]: next });

  function handleSelect(field: keyof ProductDetails, metaField: "categories" | "brands" | "suppliers", option: MetaOption) {
    if (option.isNew) onAddOption(metaField, option);
    update(field, option);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Product Information</Text>
      <FormField label="Product Name" value={value.name} onChangeText={(t) => update("name", t)} placeholder="Enter product name" />
      <View style={styles.row}>
        <SelectField label="Category" value={value.category} onChange={(o) => handleSelect("category", "categories", o)} placeholder="Select category" options={metadata.categories} />
        <View style={styles.gap} />
        <SelectField label="Brand" value={value.brand} onChange={(o) => handleSelect("brand", "brands", o)} placeholder="Select brand" options={metadata.brands} codeField="brandCode" />
      </View>
      <SelectField label="Supplier" value={value.supplier} onChange={(o) => handleSelect("supplier", "suppliers", o)} placeholder="Select supplier" options={metadata.suppliers} />
      <FormField label="Product Description" value={value.description} onChangeText={(t) => update("description", t)} placeholder="Add a short description" multiline />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  heading: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 16 }, row: { flexDirection: "row" }, gap: { width: 12 },
});
