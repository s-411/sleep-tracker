import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="w-full bg-secondary/20 py-4 px-6 rounded-2xl"
    >
      <Text className="text-foreground text-center font-semibold">
        Sign Out
      </Text>
    </TouchableOpacity>
  );
}
