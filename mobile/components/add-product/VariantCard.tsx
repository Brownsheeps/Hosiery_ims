import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FormField from "@/components/add-product/FormField";
import SelectField from "@/components/add-product/SelectField";
import type { MetaOption, ProductVariant } from "@/components/add-product/types";

interface Props {
  index: number;
  variant: ProductVariant;
  colours: MetaOption[];
  sizes: MetaOption[];
  onChange: (value: ProductVariant) => void;
  onDelete: () => void;
  onAddColour: (option: MetaOption) => void;
  onAddSize: (option: MetaOption) => void;
}

export default function VariantCard({ index, variant, colours, sizes, onChange, onDelete, onAddColour, onAddSize }: Props) {
  const update = (field: keyof ProductVariant, value: unknown) => onChange({ ...variant, [field]: value });

  function handleColour(option: MetaOption) {
    if (option.isNew) onAddColour(option);
    update("colour", option);
  }
  function handleSize(option: MetaOption) {
    if (option.isNew) onAddSize(option);
    update("size", option);
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Variant {index + 1}</Text>
        <Pressable onPress={onDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color="#DC2626" />
        </Pressable>
      </View>
      <View style={styles.row}>
        <SelectField label="Colour" value={variant.colour} onChange={handleColour} placeholder="Select colour" options={colours} codeField="colourCode" />
        <View style={styles.gap} />
        <SelectField label="Size" value={variant.size} onChange={handleSize} placeholder="Select size" options={sizes} codeField="sizeCode" />
      </View>
      <FormField label="Opening Stock" value={variant.openingStock} onChangeText={(v) => update("openingStock", v)} placeholder="0" keyboardType="numeric" />
      <View style={styles.row}>
        <FormField label="Purchase Price" value={variant.purchasePrice} onChangeText={(v) => update("purchasePrice", v)} placeholder="0.00" keyboardType="numeric" />
        <View style={styles.gap} />
        <FormField label="Selling Price" value={variant.sellingPrice} onChangeText={(v) => update("sellingPrice", v)} placeholder="0.00" keyboardType="numeric" />
      </View>
      <FormField label="Min Stock" value={variant.minStock} onChangeText={(v) => update("minStock", v)} placeholder="0" keyboardType="numeric" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }, title: { fontSize: 16, fontWeight: "700", color: "#0F172A" }, row: { flexDirection: "row" }, gap: { width: 12 },
});
