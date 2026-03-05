import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import {
  startLocationTracking,
  stopLocationTracking,
} from '@/services/backgroundLocation';

interface LocationState {
  latitude: number;
  longitude: number;
  heading: number | null;
}

export function useRiderLocation() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission not granted');
        return null;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const state: LocationState = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        heading: loc.coords.heading,
      };
      setLocation(state);
      return state;
    } catch (err) {
      setError('Failed to get location');
      return null;
    }
  }, []);

  const startTracking = useCallback(async () => {
    const success = await startLocationTracking();
    setIsTracking(success);
    if (!success) {
      setError('Failed to start background location tracking');
    }
    return success;
  }, []);

  const stopTracking = useCallback(async () => {
    await stopLocationTracking();
    setIsTracking(false);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    isTracking,
    error,
    getCurrentLocation,
    startTracking,
    stopTracking,
  };
}
