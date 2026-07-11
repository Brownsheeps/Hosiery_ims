import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ProductSearchProps } from "./interface/types";

export default function ProductSearch({ value, onChange, error }: ProductSearchProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product (SKU / Name / Variant)</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Enter SKU or product name"
        style={[styles.input, focused && styles.inputFocused]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="done"
        autoCapitalize="none"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.hint}>
        Tip: enter the SKU or select a variant from the product picker (backend search not configured).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    color: "#111827",
  },
  inputFocused: {
    borderColor: "#BFDBFE",
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  error: {
    marginTop: 8,
    color: "#DC2626",
    fontSize: 13,
  },
});
