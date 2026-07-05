import { StyleSheet, View } from "react-native";

const rows = Array.from({ length: 6 });

export default function LoadingInventory() {
  return (
    <View style={styles.container}>
      {rows.map((_, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.skeleton} />
          <View style={styles.skeletonWide} />
          <View style={styles.skeleton} />
          <View style={styles.skeleton} />
          <View style={styles.skeleton} />
          <View style={styles.skeleton} />
          <View style={styles.skeleton} />
          <View style={styles.skeleton} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  skeleton: {
    flex: 1,
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
  },
  skeletonWide: {
    flex: 2,
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
  },
});
