import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FormField from "@/components/add-product/FormField";
import SelectField from "@/components/add-product/SelectField";
import type { ProductVariant } from "@/components/add-product/types";

interface VariantCardProps { index: number; variant: ProductVariant; colours: string[]; sizes: string[]; onChange: (value: ProductVariant) => void; onDelete: () => void; onCreateColour: (value: string) => void; onCreateSize: (value: string) => void; }

export default function VariantCard({ index, variant, colours, sizes, onChange, onDelete, onCreateColour, onCreateSize }: VariantCardProps) {
  const update = (field: keyof ProductVariant, value: string) => onChange({ ...variant, [field]: value });
  return <View style={styles.card}>
    <View style={styles.cardHeader}><Text style={styles.title}>Variant {index + 1}</Text><Pressable onPress={onDelete} accessibilityLabel={`Delete variant ${index + 1}`} hitSlop={8}><Ionicons name="trash-outline" size={20} color="#DC2626" /></Pressable></View>
    <View style={styles.row}><SelectField label="Colour" value={variant.colour} onChange={(value) => update("colour", value)} onCreateOption={onCreateColour} placeholder="Select colour" options={colours} /><View style={styles.gap} /><SelectField label="Size" value={variant.size} onChange={(value) => update("size", value)} onCreateOption={onCreateSize} placeholder="Select size" options={sizes} /></View>
    <FormField label="Opening Stock" value={variant.openingStock} onChangeText={(value) => update("openingStock", value)} placeholder="0" keyboardType="numeric" />
    <View style={styles.row}><FormField label="Purchase Price" value={variant.purchasePrice} onChangeText={(value) => update("purchasePrice", value)} placeholder="0.00" keyboardType="numeric" /><View style={styles.gap} /><FormField label="Selling Price" value={variant.sellingPrice} onChangeText={(value) => update("sellingPrice", value)} placeholder="0.00" keyboardType="numeric" /></View>
    <FormField label="Variant SKU" value={variant.sku} onChangeText={(value) => update("sku", value)} placeholder="Enter variant SKU" />
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }, title: { fontSize: 16, fontWeight: "700", color: "#0F172A" }, row: { flexDirection: "row" }, gap: { width: 12 },
});
