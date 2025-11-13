import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { SignOutButton } from '../components/SignOutButton';

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-foreground mb-4">
          Sleep Tracker
        </Text>
        <Text className="text-foreground/70 text-center mb-8">
          Home Screen - Ready for Convex + Clerk
        </Text>

        <SignedOut>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/sign-in')}
            className="w-full bg-primary py-4 px-6 rounded-2xl mb-3"
          >
            <Text className="text-primary-foreground text-center font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/sign-up')}
            className="w-full bg-secondary py-4 px-6 rounded-2xl"
          >
            <Text className="text-secondary-foreground text-center font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </SignedOut>

        <SignedIn>
          <TouchableOpacity
            onPress={() => router.push('/tracking')}
            className="w-full bg-primary py-4 px-6 rounded-2xl mb-3"
          >
            <Text className="text-primary-foreground text-center font-semibold">
              Start Tracking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/history')}
            className="w-full bg-secondary py-4 px-6 rounded-2xl mb-3"
          >
            <Text className="text-secondary-foreground text-center font-semibold">
              View History
            </Text>
          </TouchableOpacity>

          <SignOutButton />
        </SignedIn>
      </View>
    </View>
  );
}
