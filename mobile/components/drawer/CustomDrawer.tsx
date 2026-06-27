import React from "react";
import { useUser, useClerk } from "@clerk/expo";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

export default function CustomDrawer(
  props: DrawerContentComponentProps
) {
      const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
  {user?.firstName ? `Hi, ${user.firstName}` : "Hosiery IMS"}
</Text>
            <Text style={styles.subtitle}>
              Wholesale Inventory
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              props.navigation.dispatch(
                DrawerActions.closeDrawer()
              )
            }
          >
            <Ionicons
              name="close"
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Divider */}

        <View style={styles.divider} />

        {/* Drawer Menu */}

        <View style={styles.menu}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* ================= FOOTER ================= */}

      <View style={styles.footer}>
        <Text style={styles.email}>
  {user?.primaryEmailAddress?.emailAddress ?? "No Email"}
</Text>

        <Text style={styles.role}>
          EMPLOYEE
        </Text>

        <TouchableOpacity
  style={styles.signOut}
  onPress={async () => {
    await signOut();
  }}
>
          <Ionicons
            name="log-out-outline"
            size={22}
            color="white"
          />

          <Text style={styles.signOutText}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    color: "#CBD5E1",
    fontSize: 15,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#233149",
  },

  menu: {
    marginTop: 10,
    paddingHorizontal: 8,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#233149",

    paddingHorizontal: 24,
    paddingVertical: 22,
  },

  email: {
    color: "#CBD5E1",
    fontSize: 14,
    marginBottom: 10,
  },

  role: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 24,
  },

  signOut: {
    flexDirection: "row",
    alignItems: "center",
  },

  signOutText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginLeft: 12,
    fontWeight: "500",
  },
});