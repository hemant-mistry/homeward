import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MotiView } from "moti";
import { LoanTheme } from "@/constants/loan-theme";

const API_BASE_URL = "http://192.168.1.100:8000";

interface PaymentItem {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  timestamp: string;
  isMilestone: boolean;
}

const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
};

// Check if payment was created within the last 24 hours
const isWithin24Hours = (isoString: string) => {
  try {
    const paymentTime = new Date(isoString).getTime();
    const now = new Date().getTime();
    const diffHours = (now - paymentTime) / (1000 * 60 * 60);
    return diffHours <= 24;
  } catch {
    return false;
  }
};

export default function HistoryScreen() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const householdId = await AsyncStorage.getItem("householdId");
      if (!householdId) return;

      const response = await fetch(
        `${API_BASE_URL}/households/${householdId}/payments`
      );
      if (!response.ok) throw new Error("Failed to fetch history");

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error("Error loading payment history:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleDelete = (paymentId: string) => {
    Alert.alert(
      "Delete Payment",
      "Are you sure you want to remove this payment entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
                method: "DELETE",
              });
              if (!response.ok) throw new Error("Failed to delete payment");

              // Optimistically filter out the deleted item from local state
              setPayments((prev) => prev.filter((p) => p.id !== paymentId));
            } catch (err) {
              Alert.alert("Error", "Could not delete payment.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={LoanTheme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {payments.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No payments logged yet.</Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={LoanTheme.primary}
            />
          }
          renderItem={({ item, index }) => {
            const showDelete = isWithin24Hours(item.timestamp);

            return (
              <MotiView
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 350, delay: index * 80 }}
                style={styles.row}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.memberName ? item.memberName[0] : "U"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {item.memberName} paid ₹{item.amount.toLocaleString("en-IN")}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {formatDate(item.timestamp)} · Cash
                  </Text>
                </View>

                {showDelete && (
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </Pressable>
                )}
              </MotiView>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LoanTheme.background, paddingHorizontal: 16, paddingTop: -10 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: LoanTheme.textPrimary,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: LoanTheme.surfaceMuted,
    borderRadius: 14,
    padding: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LoanTheme.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: LoanTheme.accent, fontWeight: "600" },
  rowTitle: { fontSize: 14, fontWeight: "500", color: LoanTheme.textPrimary },
  rowSubtitle: { fontSize: 12, color: LoanTheme.textSecondary, marginTop: 2 },
  emptyText: { color: LoanTheme.textSecondary, fontSize: 15 },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: { color: "#EF4444", fontSize: 14, fontWeight: "600" },
});