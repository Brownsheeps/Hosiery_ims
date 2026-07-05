import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string | null;
}

export default function QuantityInput({ value, onChange, error }: QuantityInputProps) {
  const [text, setText] = useState(String(value || ""));

  function handleChange(next: string) {
    // allow only digits
    const sanitized = next.replace(/[^0-9]/g, "");
    setText(sanitized);
    const num = sanitized === "" ? 0 : Number(sanitized);
    onChange(num);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quantity</Text>

      <TextInput
        value={text}
        onChangeText={handleChange}
        placeholder="1"
        keyboardType="numeric"
        style={styles.input}
        returnKeyType="done"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  error: {
    marginTop: 8,
    color: "#DC2626",
    fontSize: 13,
  },
});
