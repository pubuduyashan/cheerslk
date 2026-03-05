import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/stores/cartStore';
import { View, Text, StyleSheet } from 'react-native';

export default function TabsLayout() {
  const { t } = useTranslation();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#2a2a4a',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#8b8ba7',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: t('tabs.browse'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tabs.orders'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
