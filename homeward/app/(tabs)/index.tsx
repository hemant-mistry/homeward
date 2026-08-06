import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { ProgressTrail } from '@/components/ui/progress-trail';
import { StatCard } from '@/components/ui/stat-card';
import { MilestoneBadges } from '@/components/ui/milestone-badges';
import { LoanTheme } from '@/constants/loan-theme';

export default function HomeScreen() {
  // TODO: replace with data from your FastAPI backend
  const progress = 62;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Day!</Text>
          <Text style={styles.title}>The Mistry Home</Text>
        </View>
      </View>

      <ProgressTrail progress={progress} amountLeftLabel={`${100 - progress}% left to reach home`} />

      <View style={styles.statsRow}>
        <StatCard label="Paid off" value="₹31.2L" />
        <StatCard label="Time saved" value="7 months" />
      </View>

      <MilestoneBadges progress={progress} />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Log this month's payment</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LoanTheme.background },
  content: { padding: 16, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, color: LoanTheme.textSecondary },
  title: { fontSize: 20, fontWeight: '600', color: LoanTheme.textPrimary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12 },
  button: {
    backgroundColor: LoanTheme.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});