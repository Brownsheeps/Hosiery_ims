import { SafeAreaView, StyleSheet, View } from "react-native";
import StockOutHeader from "@/components/stock/StockOutHeader";
import StockOutForm from "@/components/stock/StockOutForm";

export default function StockOut() {
  return (
    <SafeAreaView style={styles.container}>
      <StockOutHeader />

      <View style={{ marginTop: 8 }}>
        <StockOutForm />
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