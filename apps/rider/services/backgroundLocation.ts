import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK = 'RIDER_LOCATION_TRACKING';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) return;
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const latest = locations[0];
    if (latest) {
      try {
        await fetch(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/update-rider-location`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: latest.coords.latitude,
              lng: latest.coords.longitude,
            }),
          }
        );
      } catch {}
    }
  }
});

export async function startLocationTracking(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return false;

  const bgStatus = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus.status !== 'granted') return false;

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000,
    distanceInterval: 10,
    foregroundService: {
      notificationTitle: 'CheersLK Rider',
      notificationBody: 'Tracking your location for delivery',
    },
  });

  return true;
}

export async function stopLocationTracking(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
  }
}
