import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router"; // <-- Import focus effect
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressTrail } from "@/components/ui/progress-trail";
import { StatCard } from "@/components/ui/stat-card";
import { MilestoneBadges } from "@/components/ui/milestone-badges";
import { LoanTheme } from "@/constants/loan-theme";
import { API_BASE_URL } from "@/constants/config";

const formatToLakhs = (amount: number) => {
  if (amount < 100000) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `₹${(amount / 100000).toFixed(1)}L`;
};

export default function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string>("Family");
  const [householdName, setHouseholdName] = useState<string>("The Mistry Home");

  const [dashboardData, setDashboardData] = useState({
    ownedPercentage: 0,
    totalPaidOff: 0,
    remainingPrincipal: 0,
  });
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  // 1. Check stored session on initial boot
  useEffect(() => {
    checkStoredSession();
  }, []);

  const checkStoredSession = async () => {
    try {
      const storedHouseholdId = await AsyncStorage.getItem("householdId");
      const storedMemberName = await AsyncStorage.getItem("memberName");

      if (storedHouseholdId) {
        setHouseholdId(storedHouseholdId);
        if (storedMemberName) setMemberName(storedMemberName);
        setIsAuthenticated(true);
        fetchDashboardData(storedHouseholdId);
      } else {
        setIsLoadingDashboard(false);
      }
    } catch (err) {
      console.error("Failed to load local session", err);
      setIsLoadingDashboard(false);
    }
  };

  // 2. Automatically refetch dashboard data whenever the user navigates back to this tab
  useFocusEffect(
    useCallback(() => {
      if (householdId) {
        fetchDashboardData(householdId);
      }
    }, [householdId]),
  );

  const handleValidateKey = async () => {
    if (!accessKeyInput.trim()) {
      Alert.alert("Error", "Please enter your family access key.");
      return;
    }

    try {
      setLoadingAuth(true);
      const response = await fetch(`${API_BASE_URL}/access/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey: accessKeyInput.trim() }),
      });

      if (!response.ok) {
        throw new Error("Invalid access key");
      }

      const data = await response.json();

      await AsyncStorage.setItem("memberId", data.memberId);
      await AsyncStorage.setItem("householdId", data.householdId);
      await AsyncStorage.setItem("memberName", data.memberName);

      setHouseholdId(data.householdId);
      setMemberName(data.memberName);
      setHouseholdName(data.householdName);
      setIsAuthenticated(true);

      fetchDashboardData(data.householdId);
    } catch (err) {
      Alert.alert("Access Denied", "The access key you entered is incorrect.");
    } finally {
      setLoadingAuth(false);
    }
  };

  const fetchDashboardData = async (hId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/households/${hId}/dashboard`,
      );
      if (!response.ok) throw new Error("Failed to fetch dashboard metrics");

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  if (!isAuthenticated && isLoadingDashboard) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={LoanTheme.primary} />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>Homeward</Text>
          <Text style={styles.authSubtitle}>
            Enter your family access key to link this device.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. MISTRY-COOP-2026"
            placeholderTextColor="#94a3b8"
            value={accessKeyInput}
            onChangeText={setAccessKeyInput}
            autoCapitalize="characters"
            secureTextEntry
          />

          <Pressable
            style={styles.button}
            onPress={handleValidateKey}
            disabled={loadingAuth}
          >
            {loadingAuth ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Unlock App</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Day, {memberName}!</Text>
            <Text style={styles.title}>{householdName}</Text>
          </View>
        </View>

        <ProgressTrail
          progress={dashboardData.ownedPercentage}
          amountLeftLabel={`${(100 - dashboardData.ownedPercentage).toFixed(1)}% left to reach home`}
        />

        <View style={styles.statsRow}>
          <StatCard
            label="Paid off"
            value={formatToLakhs(dashboardData.totalPaidOff)}
          />
          <StatCard
            label="Remaining"
            value={formatToLakhs(dashboardData.remainingPrincipal)}
          />
        </View>

        <MilestoneBadges progress={dashboardData.ownedPercentage} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LoanTheme.background,
    paddingTop: -15,
  },
  centerContent: { justifyContent: "center", alignItems: "center" },
  content: { paddingHorizontal: 16, paddingBottom: 24, gap: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  greeting: { fontSize: 13, color: LoanTheme.textSecondary },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: LoanTheme.textPrimary,
    marginTop: 2,
  },
  statsRow: { flexDirection: "row", gap: 12 },
  button: {
    backgroundColor: LoanTheme.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  authContainer: { flex: 1, padding: 24, justifyContent: "center", gap: 16 },
  authTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: LoanTheme.textPrimary,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 14,
    color: LoanTheme.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: LoanTheme.textPrimary,
  },
});
