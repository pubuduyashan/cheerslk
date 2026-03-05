import { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useCartStore } from '@/stores/cartStore';

export default function PaymentScreen() {
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // TODO: Get PayHere payment URL from order creation response
  const paymentUrl = '';

  const handleNavigationChange = (navState: { url: string }) => {
    const { url } = navState;

    if (url.includes('/payment/success')) {
      clearCart();
      router.replace('/(tabs)/orders');
    } else if (url.includes('/payment/cancel')) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Payment' }} />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#e94560" />
        </View>
      )}

      {paymentUrl ? (
        <WebView
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationChange}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#e94560" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  webview: { flex: 1 },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
  },
});
