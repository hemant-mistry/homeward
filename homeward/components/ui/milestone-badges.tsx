import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LoanTheme } from '@/constants/loan-theme';

const MILESTONES = [25, 50, 75, 100];

export function MilestoneBadges({ progress }: { progress: number }) {
  return (
    <View style={styles.row}>
      {MILESTONES.map((m, i) => {
        const reached = progress >= m;
        return (
          <MotiView
            key={m}
            from={{ scale: reached ? 0.6 : 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: i * 100, damping: 10 }}
            style={[styles.badge, reached && styles.badgeReached]}
          >
            <Text style={[styles.badgeText, reached && styles.badgeTextReached]}>
              {reached ? '✓' : m === 100 ? '⌂' : ''}
            </Text>
            <Text style={[styles.badgeLabel, reached && styles.badgeTextReached]}>{m}%</Text>
          </MotiView>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  badge: {
    flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center',
    borderWidth: 1, borderColor: LoanTheme.border, borderStyle: 'dashed',
  },
  badgeReached: { backgroundColor: LoanTheme.accentLight, borderStyle: 'solid', borderColor: LoanTheme.accentLight },
  badgeText: { fontSize: 14, color: LoanTheme.textMuted },
  badgeLabel: { fontSize: 11, marginTop: 2, color: LoanTheme.textMuted },
  badgeTextReached: { color: LoanTheme.accent, fontWeight: '600' },
});