import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CheersLK Rider',
  slug: 'cheerslk-rider',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'cheerslk-rider',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0f0f23',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.cheerslk.rider',
    infoPlist: {
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'CheersLK Rider needs your location to track deliveries and assign orders.',
      NSLocationWhenInUseUsageDescription:
        'CheersLK Rider needs your location to navigate to pickup and delivery locations.',
      NSLocationAlwaysUsageDescription:
        'CheersLK Rider needs background location access to track your position during deliveries.',
      UIBackgroundModes: ['location', 'fetch'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0f0f23',
    },
    package: 'com.cheerslk.rider',
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'ACCESS_BACKGROUND_LOCATION',
      'FOREGROUND_SERVICE',
      'FOREGROUND_SERVICE_LOCATION',
      'CAMERA',
    ],
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-image-picker',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'CheersLK Rider needs your location to track deliveries.',
        locationAlwaysPermission:
          'CheersLK Rider needs background location to track your position during deliveries.',
        locationWhenInUsePermission:
          'CheersLK Rider needs your location to navigate to delivery locations.',
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
      },
    ],
    'expo-task-manager',
  ],
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
  },
});
