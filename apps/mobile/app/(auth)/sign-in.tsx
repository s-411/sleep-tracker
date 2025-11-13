import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-foreground mb-6">Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
        className="w-full bg-card text-foreground px-4 py-3 rounded-xl mb-4"
        placeholderTextColor="#6E647E"
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        className="w-full bg-card text-foreground px-4 py-3 rounded-xl mb-4"
        placeholderTextColor="#6E647E"
      />
      <TouchableOpacity onPress={onSignInPress} className="w-full bg-primary py-4 rounded-xl mb-4">
        <Text className="text-primary-foreground text-center font-semibold text-lg">
          Sign in
        </Text>
      </TouchableOpacity>
      <View className="flex-row justify-center gap-2">
        <Text className="text-muted-foreground">Don't have an account?</Text>
        <Link href="/(auth)/sign-up">
          <Text className="text-primary font-semibold">Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
