import { StyleSheet, Text, View } from "react-native";

export default function EmptyInventory() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No inventory found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 220,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: {
    color: "#6B7280",
    fontSize: 14,
  },
});
