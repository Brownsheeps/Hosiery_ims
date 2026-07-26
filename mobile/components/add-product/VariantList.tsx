import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VariantCard from "@/components/add-product/VariantCard";
import type { MetaOption, ProductVariant, ProductMetadata } from "@/components/add-product/types";

interface Props {
  variants: ProductVariant[];
  metadata: Pick<ProductMetadata, "colours" | "sizes">;
  onChange: (id: string, value: ProductVariant) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onAddOption: (field: "colours" | "sizes", option: MetaOption) => void;
}

export default function VariantList({ variants, metadata, onChange, onAdd, onDelete, onAddOption }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Variants</Text>
      <View style={styles.cards}>
        {variants.map((variant, index) => (
          <VariantCard
            key={variant.id}
            index={index}
            variant={variant}
            colours={metadata.colours}
            sizes={metadata.sizes}
            onChange={(value) => onChange(variant.id, value)}
            onDelete={() => onDelete(variant.id)}
            onAddColour={(option) => onAddOption("colours", option)}
            onAddSize={(option) => onAddOption("sizes", option)}
          />
        ))}
      </View>
      <Pressable style={styles.addButton} onPress={onAdd}>
        <Ionicons name="add-circle-outline" size={19} color="#2563EB" />
        <Text style={styles.addButtonText}>Add Variant</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 22 }, heading: { fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 12 }, cards: { gap: 12 },
  addButton: { marginTop: 12, minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 10, borderWidth: 1, borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" }, addButtonText: { color: "#2563EB", fontSize: 14, fontWeight: "700" },
});
