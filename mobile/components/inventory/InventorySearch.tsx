import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

interface InventorySearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function InventorySearch({
  value,
  onChangeText,
  placeholder = "Search SKU, name, model, barcode, category...",
}: InventorySearchProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color="#6B7280" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 46,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },
});
