import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Tracking() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-foreground mb-4">
          Sleep Tracking
        </Text>
        <Text className="text-foreground/70 text-center mb-12">
          Track your sleep session - Ready for Convex integration
        </Text>

        <View className="w-full max-w-sm mb-8">
          <View className="bg-card p-8 rounded-3xl items-center">
            <Text className="text-6xl mb-4">😴</Text>
            <Text className="text-foreground text-lg mb-2">Ready to sleep?</Text>
            <Text className="text-muted-foreground text-sm">Tap below to start tracking</Text>
          </View>
        </View>

        <TouchableOpacity
          className="w-full bg-primary py-4 px-6 rounded-2xl mb-4"
        >
          <Text className="text-primary-foreground text-center font-semibold text-lg">
            Start Sleep Session
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-secondary/20 py-4 px-6 rounded-2xl"
        >
          <Text className="text-foreground text-center font-semibold">
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
