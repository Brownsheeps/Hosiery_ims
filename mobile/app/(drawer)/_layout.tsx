import { Drawer } from "expo-router/drawer";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View, Text, Button, StyleSheet } from "react-native";

import CustomDrawer from "@/components/drawer/CustomDrawer";
import { useAuthorization } from "@/hooks/useAuthorization";

export default function DrawerLayout() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user, loading, isActive, isPending, isRejected, isAdmin } = useAuthorization();

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/auth/sign-in" />;
  }

  const drawerContent = (props: any) => (
    <View style={styles.drawerRoot}>
      <CustomDrawer {...props} />
      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );

  if (!loading && !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to Load Account</Text>
        <Text style={styles.errorDescription}>Your account profile could not be loaded. Please sign in again.</Text>
        <Button title="Sign out" onPress={() => signOut()} color="#EF4444" />
      </View>
    );
  }

  if (!loading && !isActive) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Account Inactive</Text>
        <Text style={styles.errorDescription}>Your account has been deactivated.</Text>
        <Button title="Sign out" onPress={() => signOut()} color="#EF4444" />
      </View>
    );
  }

  if (!loading && isPending) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Pending Approval</Text>
        <Text style={styles.errorDescription}>Your account is awaiting administrator approval.</Text>
        <Button title="Sign out" onPress={() => signOut()} color="#EF4444" />
      </View>
    );
  }

  if (!loading && isRejected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Access Denied</Text>
        <Text style={styles.errorDescription}>Your account has been rejected.</Text>
        <Button title="Sign out" onPress={() => signOut()} color="#EF4444" />
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={drawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#0F172A",
          width: 290,
        },
        drawerActiveBackgroundColor: "#26395B",
        drawerActiveTintColor: "#FFFFFF",
        drawerInactiveTintColor: "#FFFFFF",
        drawerLabelStyle: {
          fontSize: 17,
          fontWeight: "600",
        },
        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: 10,
          marginVertical: 2,
        },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="inventory"
        options={{
          title: "Inventory",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="add-product"
        options={{
          title: "Add Product",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="stock-in"
        options={{
          title: "Stock In",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="arrow-down-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="stock-out"
        options={{
          title: "Stock Out",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="arrow-up-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="stock-adjustment"
        options={{
          title: "Stock Adjustment",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="create-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="invoice"
        options={{
          title: "Invoice",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="reports"
        options={{
          title: "Reports",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="user-approvals"
        options={{
          title: "User Approvals",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
          drawerItemStyle: { display: isAdmin ? 'flex' : 'none' }
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
          drawerItemStyle: { display: isAdmin ? 'flex' : 'none' }
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerRoot: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0F172A'
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 24,
  },
  errorTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorDescription: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  }
});
