import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

interface DeliveryMapProps {
  deliveryLocation: { lat: number; lng: number };
  riderLocation?: { lat: number; lng: number } | null;
  height?: number;
}

export function DeliveryMap({ deliveryLocation, riderLocation, height = 200 }: DeliveryMapProps) {
  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: deliveryLocation.lat,
          longitude: deliveryLocation.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        customMapStyle={darkMapStyle}
      >
        <Marker coordinate={{ latitude: deliveryLocation.lat, longitude: deliveryLocation.lng }}>
          <View style={styles.destinationMarker}>
            <Ionicons name="home" size={14} color="#ffffff" />
          </View>
        </Marker>

        {riderLocation && (
          <Marker coordinate={{ latitude: riderLocation.lat, longitude: riderLocation.lng }}>
            <View style={styles.riderMarker}>
              <Ionicons name="bicycle" size={16} color="#ffffff" />
            </View>
          </Marker>
        )}
      </MapView>
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
  container: { borderRadius: 12, overflow: 'hidden' },
  map: { flex: 1 },
  destinationMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  riderMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
