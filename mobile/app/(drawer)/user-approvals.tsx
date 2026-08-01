import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuthorization } from "@/hooks/useAuthorization";
import UserApprovalsScreen from "@/screens/UserApprovalsScreen";

export default function UserApprovalsRoute() {
  const { isAdmin, loading } = useAuthorization();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return <Redirect href="/dashboard" />;
  }

  return <UserApprovalsScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
