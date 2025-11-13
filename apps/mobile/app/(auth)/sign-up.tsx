import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-background p-6 justify-center">
        <Text className="text-3xl font-bold text-foreground mb-6">Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
          className="w-full bg-card text-foreground px-4 py-3 rounded-xl mb-4"
          placeholderTextColor="#6E647E"
        />
        <TouchableOpacity onPress={onVerifyPress} className="w-full bg-primary py-4 rounded-xl">
          <Text className="text-primary-foreground text-center font-semibold text-lg">
            Verify
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-foreground mb-6">Sign up</Text>
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
      <TouchableOpacity onPress={onSignUpPress} className="w-full bg-primary py-4 rounded-xl mb-4">
        <Text className="text-primary-foreground text-center font-semibold text-lg">
          Continue
        </Text>
      </TouchableOpacity>
      <View className="flex-row justify-center gap-2">
        <Text className="text-muted-foreground">Already have an account?</Text>
        <Link href="/(auth)/sign-in">
          <Text className="text-primary font-semibold">Sign in</Text>
        </Link>
      </View>
    </View>
  );
}
