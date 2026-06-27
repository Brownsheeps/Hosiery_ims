import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryToolbar from "@/components/inventory/InventoryToolbar";

export default function Inventory() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <SafeAreaView style={styles.container}>
      <InventoryHeader totalItems={0} totalCount={0} onExport={() => {}} />
      <InventoryToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <View style={styles.placeholder} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  placeholder: {
    flex: 1,
  },
});