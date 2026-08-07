import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MotiView, AnimatePresence } from "moti";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoanTheme } from "@/constants/loan-theme";
import { API_BASE_URL } from "@/constants/config";

type Method = "cash" | "cheque";

export default function PaymentModal() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [method, setMethod] = useState<Method>("cash");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleSubmit = async () => {
    if (!amount) return;

    try {
      setIsSubmitting(true);

      // Retrieve the stored memberId from AsyncStorage
      const memberId = await AsyncStorage.getItem("memberId");

      if (!memberId) {
        Alert.alert(
          "Session Error",
          "Please log in again with your access key.",
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/members/${memberId}/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            paidOn: date.toISOString(),
            payment_method: method,
            notes: notes.trim() || null,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save payment to server");
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSubmitted(true);
      setTimeout(() => router.back(), 900);
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Could not log payment. Check your server connection.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <MotiView
          from={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 9 }}
          style={styles.successCircle}
        >
          <Text style={styles.successCheck}>✓</Text>
        </MotiView>
        <Text style={styles.successText}>Payment logged</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        style={styles.content}
      >
        <Text style={styles.title}>Log a payment</Text>
        <Text style={styles.subtitle}>Every bit adds to the trail home</Text>

        <Text style={styles.label}>Amount paid</Text>
        <View style={styles.amountRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={LoanTheme.textMuted}
            keyboardType="numeric"
            style={styles.amountInput}
          />
        </View>

        <Text style={styles.label}>Date paid</Text>
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateButtonText}>{formattedDate}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            maximumDate={new Date()}
            onChange={(_, selected) => {
              setShowPicker(Platform.OS === "ios");
              if (selected) setDate(selected);
            }}
          />
        )}

        <Text style={styles.label}>Paid via</Text>
        <View style={styles.methodRow}>
          {(["cash", "cheque"] as Method[]).map((m) => {
            const active = method === m;
            return (
              <Pressable
                key={m}
                onPress={() => setMethod(m)}
                style={styles.methodButtonWrapper}
              >
                <AnimatePresence>
                  <MotiView
                    animate={{
                      backgroundColor: active
                        ? LoanTheme.primary
                        : LoanTheme.surfaceMuted,
                    }}
                    transition={{ type: "timing", duration: 200 }}
                    style={styles.methodButton}
                  >
                    <Text
                      style={[
                        styles.methodText,
                        active && styles.methodTextActive,
                      ]}
                    >
                      {m === "cash" ? "Cash" : "Cheque"}
                    </Text>
                  </MotiView>
                </AnimatePresence>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add a short note..."
          placeholderTextColor={LoanTheme.textMuted}
          style={styles.notesInput}
          multiline
          maxLength={150}
        />

        <Pressable onPress={handleSubmit} disabled={!amount || isSubmitting}>
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: amount ? 1 : 0.98 }}
            style={[
              styles.submitButton,
              (!amount || isSubmitting) && styles.submitButtonDisabled,
            ]}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? "Saving..." : "Add to trail"}
            </Text>
          </MotiView>
        </Pressable>
      </MotiView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LoanTheme.background },
  content: { padding: 20, gap: 6 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: LoanTheme.textPrimary,
    marginTop: 12,
  },
  subtitle: { fontSize: 13, color: LoanTheme.textSecondary, marginBottom: 16 },
  label: {
    fontSize: 13,
    color: LoanTheme.textSecondary,
    marginTop: 14,
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LoanTheme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LoanTheme.border,
    paddingHorizontal: 14,
  },
  rupee: { fontSize: 20, color: LoanTheme.textSecondary, marginRight: 6 },
  amountInput: {
    flex: 1,
    fontSize: 22,
    paddingVertical: 12,
    color: LoanTheme.textPrimary,
  },
  dateButton: {
    backgroundColor: LoanTheme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LoanTheme.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  dateButtonText: { fontSize: 15, color: LoanTheme.textPrimary },
  methodRow: { flexDirection: "row", gap: 10 },
  methodButtonWrapper: { flex: 1 },
  methodButton: { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  methodText: {
    fontSize: 14,
    fontWeight: "500",
    color: LoanTheme.textSecondary,
  },
  methodTextActive: { color: "#FFFFFF" },
  notesInput: {
    backgroundColor: LoanTheme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LoanTheme.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: LoanTheme.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top', 
  },
  submitButton: {
    marginTop: 28,
    backgroundColor: LoanTheme.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  successContainer: {
    flex: 1,
    backgroundColor: LoanTheme.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  successCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: LoanTheme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  successCheck: { color: "#FFFFFF", fontSize: 36, fontWeight: "600" },
  successText: {
    fontSize: 16,
    color: LoanTheme.textPrimary,
    fontWeight: "500",
  },
});
