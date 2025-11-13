import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="tracking" />
      <Stack.Screen name="history" />
      <Stack.Screen name="details/[id]" />
    </Stack>
  );
}
