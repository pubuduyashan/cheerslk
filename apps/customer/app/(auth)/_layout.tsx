import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f0f23' } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify-age" />
    </Stack>
  );
}
