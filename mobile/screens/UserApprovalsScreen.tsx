import { useCallback, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

import ApprovalCard from "@/components/approvals/ApprovalCard";
import EmptyApprovalState from "@/components/approvals/EmptyApprovalState";
import { useApi } from "@/hooks/useApi";
import type { PendingUser } from "@/types/approval.types";

interface PendingUsersApiResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    full_name: string;
    email: string;
    status: "PENDING";
    created_at: string;
  }[];
}

interface UserApprovalApiResponse {
  success: boolean;
  message?: string;
}

export default function UserApprovalsScreen() {
  const navigation = useNavigation();
  const { request } = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingUserId, setSubmittingUserId] = useState<string | null>(null);

  const fetchPendingUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await request("/api/users/pending");
      const json: PendingUsersApiResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Unable to load approval requests.");
      }

      setPendingUsers(
        json.data.map((user) => ({
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          status: user.status,
          createdAt: user.created_at,
        })),
      );
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load approval requests.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void fetchPendingUsers();
  }, [fetchPendingUsers]);

  const filteredPendingUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return pendingUsers;
    }

    return pendingUsers.filter((user) =>
      [user.fullName, user.email].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [pendingUsers, searchQuery]);

  async function updateUserApproval(user: PendingUser, action: "approve" | "reject") {
    setSubmittingUserId(user.id);

    try {
      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (action === "approve") {
        options.body = JSON.stringify({ roleId: 2 });
      }

      const response = await request(`/api/users/${user.id}/${action}`, options);
      const json: UserApprovalApiResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || `Unable to ${action} user.`);
      }

      setPendingUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== user.id));
      Alert.alert("Success", json.message || `User ${action === "approve" ? "approved" : "rejected"}.`);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : `Unable to ${action} user.`;
      Alert.alert("Error", message);
    } finally {
      setSubmittingUserId(null);
    }
  }

  function handleApprove(user: PendingUser) {
    void updateUserApproval(user, "approve");
  }

  function handleRetry() {
    void fetchPendingUsers();
  }

  function handleReject(user: PendingUser) {
    void updateUserApproval(user, "reject");
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
        data={error ? [] : filteredPendingUsers}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => (
          <ApprovalCard
            user={item}
            onApprove={handleApprove}
            onReject={handleReject}
            isSubmitting={submittingUserId === item.id}
          />
        )}
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
