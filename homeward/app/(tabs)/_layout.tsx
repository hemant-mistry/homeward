import { Tabs } from 'expo-router';
import React from 'react';

import { Stack } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Log a payment' }} />
    </Stack>
  );
}
