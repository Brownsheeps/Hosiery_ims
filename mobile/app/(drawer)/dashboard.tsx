import { useEffect, useState } from "react";
import { useClerk } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import StatsSection from "@/components/dashboard/StatsSection";
import RecentActivitySection from "@/components/dashboard/RecentActivitySection";
import LowStockSection from "@/components/dashboard/LowStockSection";
import { API_BASE_URL } from "@/constants/api";

interface DashboardResponse {
  stats: {
    totalSku: number;
    totalStock: number;
    lowStock: number;
    outStock: number;
  };

  recentTransactions: Array<{
    id: number;
    productName: string;
    sku: string;
    transactionType: string;
    quantity: number;
    employeeName: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: number;
    sku: string;
    itemName: string;
    currentStock: number;
    minStock: number;
  }>;
}

export default function Dashboard() {
  const { signOut } = useClerk();
  const navigation = useNavigation();

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const response = await fetch(
         `${API_BASE_URL}/api/dashboard`
      );

      const json = await response.json();

      console.log(json);

      setDashboard(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 12 }}>
          Loading Dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {dashboard && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() =>
                navigation.dispatch(DrawerActions.openDrawer())
              }
            >
              <Ionicons
                name="menu"
                size={30}
                color="#111827"
              />
            </Pressable>

            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.title}>Dashboard</Text>

              <Text style={styles.subtitle}>
                Overview of your wholesale inventory
              </Text>
            </View>

            <Pressable
              onPress={() => signOut()}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>
                Logout
              </Text>
            </Pressable>
          </View>

          <StatsSection stats={dashboard.stats} />
          <RecentActivitySection transactions={dashboard.recentTransactions} />
          <LowStockSection products={dashboard.lowStockProducts} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 15,
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});