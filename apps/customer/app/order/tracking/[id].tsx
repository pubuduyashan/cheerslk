import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { Order } from '@cheerslk/shared-types';

const { width, height } = Dimensions.get('window');

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    // TODO: Subscribe to rider location updates via Supabase Realtime
    return () => {
      // TODO: Unsubscribe
    };
  }, [id]);

  const deliveryLocation = order?.address
    ? { latitude: order.address.lat, longitude: order.address.lng }
    : { latitude: 6.9271, longitude: 79.8612 }; // Default Colombo

  const riderMarker = riderLocation
    ? { latitude: riderLocation.lat, longitude: riderLocation.lng }
    : null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t('order.liveTracking') }} />

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...deliveryLocation,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        customMapStyle={darkMapStyle}
      >
        <Marker coordinate={deliveryLocation} title={t('order.deliveryLocation')}>
          <View style={styles.destinationMarker}>
            <Ionicons name="home" size={18} color="#ffffff" />
          </View>
        </Marker>

        {riderMarker && (
          <Marker coordinate={riderMarker} title={t('order.rider')}>
            <View style={styles.riderMarker}>
              <Ionicons name="bicycle" size={20} color="#ffffff" />
            </View>
          </Marker>
        )}

        {riderMarker && (
          <Polyline
            coordinates={[riderMarker, deliveryLocation]}
            strokeColor="#e94560"
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{t('order.riderOnTheWay')}</Text>
        </View>

        {eta && (
          <Text style={styles.etaText}>
            {t('order.eta', { minutes: eta })}
          </Text>
        )}

        <View style={styles.riderRow}>
          <View style={styles.riderAvatar}>
            <Ionicons name="person" size={20} color="#ffffff" />
          </View>
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{t('order.yourRider')}</Text>
            <Text style={styles.riderVehicle}>{t('order.motorcycle')}</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="call" size={20} color="#10B981" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble" size={20} color="#e94560" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  map: { flex: 1 },
  destinationMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  riderMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  bottomSheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981' },
  statusText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  etaText: { color: '#e94560', fontSize: 16, fontWeight: '600' },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  riderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2a2a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  riderInfo: { flex: 1 },
  riderName: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  riderVehicle: { color: '#8b8ba7', fontSize: 13 },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
