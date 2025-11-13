import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-foreground mb-4">
          Track Your Sleep Quality
        </Text>
        <Text className="text-foreground/70 text-center mb-12">
          Monitor your sleep patterns and improve your rest quality
        </Text>

        <View className="w-full space-y-3 mb-12">
          <View className="flex-row items-center gap-3 px-4 py-3 bg-card rounded-2xl">
            <View className="w-10 h-10 bg-primary/20 rounded-xl items-center justify-center">
              <Text className="text-primary text-2xl">📊</Text>
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-medium">Sleep Analysis</Text>
              <Text className="text-muted-foreground text-xs">Track patterns & trends</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 px-4 py-3 bg-card rounded-2xl">
            <View className="w-10 h-10 bg-accent/20 rounded-xl items-center justify-center">
              <Text className="text-accent text-2xl">⏰</Text>
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-medium">Smart Alarms</Text>
              <Text className="text-muted-foreground text-xs">Wake up refreshed</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 px-4 py-3 bg-card rounded-2xl">
            <View className="w-10 h-10 bg-secondary/20 rounded-xl items-center justify-center">
              <Text className="text-secondary text-2xl">💚</Text>
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-medium">Health Insights</Text>
              <Text className="text-muted-foreground text-xs">Improve your rest</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/')}
          className="w-full bg-primary py-4 px-6 rounded-2xl"
        >
          <Text className="text-primary-foreground text-center font-semibold text-lg">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
