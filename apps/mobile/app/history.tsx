import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function History() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-3xl font-bold text-foreground mb-2">
          Sleep History
        </Text>
        <Text className="text-muted-foreground mb-6">
          Ready for Convex data
        </Text>

        <ScrollView className="flex-1">
          <View className="bg-card p-6 rounded-2xl mb-4">
            <Text className="text-foreground text-center">
              No sleep sessions yet
            </Text>
            <Text className="text-muted-foreground text-center text-sm mt-2">
              Sleep data will appear here once Convex is connected
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-secondary py-4 px-6 rounded-2xl mt-4"
        >
          <Text className="text-secondary-foreground text-center font-semibold">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
