import { SafeAreaView, StyleSheet, View } from "react-native";
import StockHeader from "@/components/stock/StockHeader";
import StockInForm from "@/components/stock/StockInForm";

export default function StockIn() {
  return (
    <SafeAreaView style={styles.container}>
      <StockHeader />

      <View style={{ marginTop: 8 }}>
        <StockInForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
});