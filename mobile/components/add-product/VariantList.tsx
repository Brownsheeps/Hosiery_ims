import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VariantCard from "@/components/add-product/VariantCard";
import type { ProductVariant } from "@/components/add-product/types";

interface VariantListProps { variants: ProductVariant[]; onChange: (id: string, value: ProductVariant) => void; onAdd: () => void; onDelete: (id: string) => void; }

export default function VariantList({ variants, onChange, onAdd, onDelete }: VariantListProps) {
  const [colours, setColours] = useState(["Black", "White", "Blue", "Grey", "Red"]);
  const [sizes, setSizes] = useState(["S", "M", "L", "XL", "Free Size"]);
  const addOption = (setOptions: React.Dispatch<React.SetStateAction<string[]>>, option: string) => setOptions((current) => current.some((item) => item.toLowerCase() === option.toLowerCase()) ? current : [...current, option]);
  return <View style={styles.section}>
    <Text style={styles.heading}>Variants</Text>
    <View style={styles.cards}>{variants.map((variant, index) => <VariantCard key={variant.id} index={index} variant={variant} colours={colours} sizes={sizes} onChange={(value) => onChange(variant.id, value)} onDelete={() => onDelete(variant.id)} onCreateColour={(option) => addOption(setColours, option)} onCreateSize={(option) => addOption(setSizes, option)} />)}</View>
    <Pressable style={styles.addButton} onPress={onAdd}><Ionicons name="add-circle-outline" size={19} color="#2563EB" /><Text style={styles.addButtonText}>Add Variant</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  section: { marginTop: 22 }, heading: { fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 12 }, cards: { gap: 12 },
  addButton: { marginTop: 12, minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 10, borderWidth: 1, borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" }, addButtonText: { color: "#2563EB", fontSize: 14, fontWeight: "700" },
});
