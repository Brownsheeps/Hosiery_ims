import { StyleSheet, Text, TextInput, View } from "react-native";

interface RemarksInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RemarksInput({ value, onChange }: RemarksInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Remarks (optional)</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Add remarks"
        style={[styles.input, { height: 100 }]}
        multiline
        textAlignVertical="top"
      />
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
});
