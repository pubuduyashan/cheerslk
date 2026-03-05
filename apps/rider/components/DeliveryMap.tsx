import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

interface Location {
  latitude: number;
  longitude: number;
}

interface DeliveryMapProps {
  riderLocation: Location | null;
  pickupLocation?: Location;
  dropoffLocation?: Location;
  showRoute?: boolean;
}

export function DeliveryMap({
  riderLocation,
  pickupLocation,
  dropoffLocation,
  showRoute,
}: DeliveryMapProps) {
  const defaultRegion = {
    latitude: riderLocation?.latitude ?? 6.9271,
    longitude: riderLocation?.longitude ?? 79.8612,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const routeCoords: Location[] = [];
  if (riderLocation) routeCoords.push(riderLocation);
  if (pickupLocation) routeCoords.push(pickupLocation);
  if (dropoffLocation) routeCoords.push(dropoffLocation);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={defaultRegion}
        showsUserLocation
        showsMyLocationButton
        customMapStyle={darkMapStyle}
      >
        {pickupLocation && (
          <Marker
            coordinate={pickupLocation}
            title="Pickup"
            pinColor="#16c79a"
          />
        )}
        {dropoffLocation && (
          <Marker
            coordinate={dropoffLocation}
            title="Dropoff"
            pinColor="#e94560"
          />
        )}
        {showRoute && routeCoords.length >= 2 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#16c79a"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f23' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b8ba7' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2a2a3e' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f0f23' }],
  },
];

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
