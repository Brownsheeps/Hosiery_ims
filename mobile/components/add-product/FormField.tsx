import { StyleSheet, Text, TextInput, View } from "react-native";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
}

export default function FormField({ label, value, onChangeText, placeholder, multiline = false, keyboardType = "default" }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "700", color: "#475569", marginBottom: 6 },
  input: { minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#FFFFFF", paddingHorizontal: 12, color: "#0F172A", fontSize: 14 },
  multiline: { minHeight: 92, paddingTop: 12, paddingBottom: 12 },
});
