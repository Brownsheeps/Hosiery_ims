import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { QuantityInputProps, QuantityValueState } from "./interface/types";

export default function QuantityInput({ value, onChange, error }: QuantityInputProps) {
  const [boxQuantity, setBoxQuantity] = useState(value.boxQuantity);
  const [unitsPerBox, setUnitsPerBox] = useState(value.unitsPerBox);
  const [looseUnits, setLooseUnits] = useState(value.looseUnits);

  useEffect(() => {
    setBoxQuantity(value.boxQuantity);
    setUnitsPerBox(value.unitsPerBox);
    setLooseUnits(value.looseUnits);
  }, [value.boxQuantity, value.unitsPerBox, value.looseUnits]);

  function handleChange(next: string, field: keyof QuantityValueState) {
    const sanitized = next.replace(/[^0-9]/g, "");
    const numericValue = sanitized === "" ? 0 : Number(sanitized);

    const nextBoxQuantity = field === "boxQuantity" ? numericValue : boxQuantity;
    const nextUnitsPerBox = field === "unitsPerBox" ? numericValue : unitsPerBox;
    const nextLooseUnits = field === "looseUnits" ? numericValue : looseUnits;

    setBoxQuantity(nextBoxQuantity);
    setUnitsPerBox(nextUnitsPerBox);
    setLooseUnits(nextLooseUnits);

    onChange({
      boxQuantity: nextBoxQuantity,
      unitsPerBox: nextUnitsPerBox,
      looseUnits: nextLooseUnits,
      totalQuantity: (nextBoxQuantity * nextUnitsPerBox) + nextLooseUnits,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quantity</Text>

      <View style={styles.row}>
        <View style={styles.fieldCol}>
          <Text style={styles.fieldLabel}>Box Quantity</Text>
          <TextInput
            value={boxQuantity > 0 ? String(boxQuantity) : ""}
            onChangeText={(next) => handleChange(next, "boxQuantity")}
            placeholder="0"
            keyboardType="numeric"
            style={styles.input}
            returnKeyType="done"
          />
        </View>

        <View style={styles.fieldCol}>
          <Text style={styles.fieldLabel}>Units Per Box</Text>
          <TextInput
            value={unitsPerBox > 0 ? String(unitsPerBox) : ""}
            onChangeText={(next) => handleChange(next, "unitsPerBox")}
            placeholder="0"
            keyboardType="numeric"
            style={styles.input}
            returnKeyType="done"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.fieldCol}>
          <Text style={styles.fieldLabel}>Loose Units</Text>
          <TextInput
            value={looseUnits > 0 ? String(looseUnits) : ""}
            onChangeText={(next) => handleChange(next, "looseUnits")}
            placeholder="0"
            keyboardType="numeric"
            style={styles.input}
            returnKeyType="done"
          />
        </View>

        <View style={styles.fieldCol}>
          <Text style={styles.fieldLabel}>Total Quantity</Text>
          <TextInput
            value={value.totalQuantity > 0 ? String(value.totalQuantity) : ""}
            editable={false}
            placeholder="0"
            style={[styles.input, styles.readOnlyInput]}
          />
        </View>
      </View>

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
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  fieldCol: {
    flex: 1,
    minWidth: 140,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 6,
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
  readOnlyInput: {
    backgroundColor: "#F3F4F6",
    color: "#111827",
  },
  error: {
    marginTop: 8,
    color: "#DC2626",
    fontSize: 13,
  },
});
