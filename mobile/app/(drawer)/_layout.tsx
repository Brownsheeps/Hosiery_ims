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

  // Wait for Clerk to initialize and profile to load (if signed in)
  if (!isLoaded || (isSignedIn && loading)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // If signed out, send user to login
  if (!isSignedIn) {
    return <Redirect href="/auth/sign-in" />;
  }

  // Protect navigation if user is not active or not approved
  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to Load Account</Text>
        <Text style={styles.errorDescription}>Your account profile could not be loaded. Please sign in again.</Text>
        <Button title="Sign out" onPress={() => signOut()} color="#EF4444" />
      </View>
    );
  }

  if (!isActive) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Account Inactive</Text>
        <Text style={styles.errorDescription}>Your account has been deactivated.</Text>
        <Button title="Sign out" onPress={() => signOut()} color="#EF4444" />
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Pending Approval</Text>
        <Text style={styles.errorDescription}>Your account is awaiting administrator approval.</Text>
        <Button title="Sign out" onPress={() => signOut()} color="#EF4444" />
      </View>
    );
  }

  if (isRejected) {
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
      drawerContent={(props) => <CustomDrawer {...props} />}
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

      {/* Admin specific routes - Only register these if admin */}
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
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0F172A'
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
