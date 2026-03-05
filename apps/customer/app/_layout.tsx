import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/stores/authStore';
import '@cheerslk/i18n';

export default function RootLayout() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f0f23' },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{ headerShown: true, title: '', headerTransparent: true }}
        />
        <Stack.Screen
          name="category/[slug]"
          options={{ headerShown: true, title: '' }}
        />
        <Stack.Screen
          name="cart/index"
          options={{ headerShown: true, title: 'Cart' }}
        />
        <Stack.Screen
          name="checkout/index"
          options={{ headerShown: true, title: 'Checkout' }}
        />
        <Stack.Screen
          name="order/[id]"
          options={{ headerShown: true, title: 'Order Details' }}
        />
      </Stack>
    </>
  );
}
