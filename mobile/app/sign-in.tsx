import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({
        session: result.createdSessionId,
      });

      router.replace("/");
    } catch (err: any) {
      Alert.alert("Login Failed", JSON.stringify(err.errors));
    }
  };

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10 }}
      />

      <Button title="Sign In" onPress={onSignInPress} />
    </View>
  );
}