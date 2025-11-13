import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Details() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-foreground mb-2">
          Sleep Details
        </Text>
        <Text className="text-muted-foreground mb-6">
          Session ID: {id}
        </Text>

        <View className="bg-card p-6 rounded-2xl mb-6">
          <Text className="text-foreground text-center">
            Sleep session details will appear here
          </Text>
          <Text className="text-muted-foreground text-center text-sm mt-2">
            Ready for Convex data integration
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-secondary py-4 px-6 rounded-2xl"
        >
          <Text className="text-secondary-foreground text-center font-semibold">
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
