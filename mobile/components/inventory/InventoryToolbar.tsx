import { StyleSheet, View } from "react-native";

import CategoryFilter, { type CategoryOption } from "./CategoryFilter";
import InventorySearch from "./InventorySearch";

interface InventoryToolbarProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
  categories?: CategoryOption[];
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
}

export default function InventoryToolbar({
  searchValue,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: InventoryToolbarProps) {
  return (
    <View style={styles.container}>
      <InventorySearch value={searchValue} onChangeText={onSearchChange} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onChangeCategory={onCategoryChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
});
