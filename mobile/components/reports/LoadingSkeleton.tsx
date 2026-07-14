import { StyleSheet, View } from "react-native";

export default function LoadingSkeleton() {
  return (
    <View>
      {[0, 1, 2, 3].map((item) => (
        <View key={item} style={styles.cardSkeleton} />
      ))}
      <View style={styles.tableSkeleton} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardSkeleton: {
    height: 80,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  tableSkeleton: {
    height: 260,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginTop: 8,
  },
});
