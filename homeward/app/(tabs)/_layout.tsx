import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeColor = "#2F4F4F";
  const inactiveColor = "#111111";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: false,
        tabBarStyle: {
          display: "flex",
          backgroundColor: "#FAF9F6",
          borderTopWidth: 1,
          borderTopColor: "#E7E3DA",
          height: 72 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Homeward",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#FAF9F6",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#2F4F4F",
            fontSize: 20,
          },
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? activeColor : inactiveColor;
            return <Ionicons name={focused ? "home" : "home-outline"} size={28} color={iconColor} />;
          },
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "Log",
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? activeColor : inactiveColor;
            return <MaterialIcons name={focused ? "add-circle" : "add-circle-outline"} size={28} color={iconColor} />;
          },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/modal");
          },
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerTitle: "Payment History",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#FAF9F6",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#2F4F4F",
            fontSize: 20,
          },
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? activeColor : inactiveColor;
            return <MaterialIcons name={focused ? "history" : "history-toggle-off"} size={28} color={iconColor} />;
          },
        }}
      />
    </Tabs>
  );
}
