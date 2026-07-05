import { StyleSheet, View } from "react-native";

const rows = Array.from({ length: 4 });

export default function LoadingStockIn() {
  return (
    <View style={styles.container}>
      {rows.map((_, i) => (
        <View key={i} style={styles.row} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    height: 48,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 12,
  },
});
