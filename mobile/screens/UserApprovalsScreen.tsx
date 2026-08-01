import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

import ApprovalCard from "@/components/approvals/ApprovalCard";
import EmptyApprovalState from "@/components/approvals/EmptyApprovalState";
import { mockPendingUsers } from "@/data/mockPendingUsers";
import type { PendingUser } from "@/types/approval.types";

export default function UserApprovalsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = false;
  const error: string | null = null;

  const pendingUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return mockPendingUsers;
    }

    return mockPendingUsers.filter((user) =>
      [user.fullName, user.email].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [searchQuery]);

  function handleApprove(user: PendingUser) {
    // TODO:
    // Call approve user API
    void user;
  }

  function handleReject(user: PendingUser) {
    // TODO:
    // Call reject user API
    void user;
  }

  function handleRetry() {
    // TODO:
    // Retry pending user approvals API request
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading approval requests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={error ? [] : pendingUsers}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => <ApprovalCard user={item} onApprove={handleApprove} onReject={handleReject} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Pressable
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={styles.menuButton}
                accessibilityRole="button"
                accessibilityLabel="Open navigation menu"
              >
                <Ionicons name="menu" size={28} color="#111827" />
              </Pressable>
              <Text style={styles.title}>User Approvals</Text>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color="#6B7280" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search employee..."
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Search employee approvals"
              />
            </View>
          </>
        }
        ListEmptyComponent={
          error ? (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={36} color="#DC2626" />
              <Text style={styles.errorTitle}>Unable to load approval requests</Text>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <EmptyApprovalState searchQuery={searchQuery} />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  menuButton: {
    marginRight: 12,
  },
  title: {
    paddingTop: 15,
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorCard: {
    marginTop: 18,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  errorTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#2563EB",
  },
  retryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
