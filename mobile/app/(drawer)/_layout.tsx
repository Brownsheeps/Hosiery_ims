import { Drawer } from "expo-router/drawer";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";

import CustomDrawer from "@/components/drawer/CustomDrawer";

export default function DrawerLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for Clerk to initialize
  if (!isLoaded) {
    return null;
  }

  // If signed out, send user to login
  if (!isSignedIn) {
    return <Redirect href="/auth/sign-in" />;
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
            <Ionicons
              name="grid-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="inventory"
        options={{
          title: "Inventory",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="cube-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="stock-in"
        options={{
          title: "Stock In",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="arrow-down-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="stock-out"
        options={{
          title: "Stock Out",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="arrow-up-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="stock-adjustment"
        options={{
          title: "Stock Adjustment",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="create-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="reports"
        options={{
          title: "Reports",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="document-text-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer>
  );
}