import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StockInHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={28} color="#111827" />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Stock In</Text>
        <Text style={styles.subtitle}>Record inward stock</Text>
      </View>

      <View style={{ width: 48 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  menuButton: {
    marginRight: 12,
    width: 48,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
});
