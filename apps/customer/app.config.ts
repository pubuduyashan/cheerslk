import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CheersLK',
  slug: 'cheerslk',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'cheerslk',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#1a1a2e',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.cheerslk.customer',
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1a1a2e',
    },
    package: 'com.cheerslk.customer',
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
      },
    },
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-image-picker',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow CheersLK to use your location for delivery.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});
