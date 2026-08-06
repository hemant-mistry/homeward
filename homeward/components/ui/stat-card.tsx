import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LoanTheme } from '@/constants/loan-theme';

type Props = { label: string; value: string; delay?: number };

export function StatCard({ label, value, delay = 0 }: Props) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 450, delay }}
      style={styles.card}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: LoanTheme.surfaceMuted, borderRadius: 16, padding: 12 },
  label: { fontSize: 12, color: LoanTheme.textSecondary, marginBottom: 4 },
  value: { fontSize: 17, fontWeight: '600', color: LoanTheme.textPrimary },
});