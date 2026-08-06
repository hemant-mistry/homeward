import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LoanTheme } from '@/constants/loan-theme';

// TODO: replace with data fetched from your FastAPI backend
const MOCK_PAYMENTS = [
  { id: '1', amount: 18000, date: '4 Aug 2026', method: 'Cash', by: 'Mom' },
  { id: '2', amount: 10000, date: '4 Aug 2026', method: 'Cheque', by: 'Dad' },
  { id: '3', amount: 15000, date: '2 Jul 2026', method: 'Cash', by: 'You' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment history</Text>
      <FlatList
        data={MOCK_PAYMENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350, delay: index * 80 }}
            style={styles.row}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.by[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.by} paid ₹{item.amount.toLocaleString('en-IN')}</Text>
              <Text style={styles.rowSubtitle}>{item.date} · {item.method}</Text>
            </View>
          </MotiView>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LoanTheme.background, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', color: LoanTheme.textPrimary, marginBottom: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: LoanTheme.surfaceMuted, borderRadius: 14, padding: 12,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: LoanTheme.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: LoanTheme.accent, fontWeight: '600' },
  rowTitle: { fontSize: 14, fontWeight: '500', color: LoanTheme.textPrimary },
  rowSubtitle: { fontSize: 12, color: LoanTheme.textSecondary, marginTop: 2 },
});