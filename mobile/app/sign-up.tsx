import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";

export default function SignUpPage() {
  const { signUp, isLoaded } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      Alert.alert(
        "Success",
        "User created. Check your email verification settings."
      );
    } catch (err: any) {
      Alert.alert("Signup Failed", JSON.stringify(err.errors));
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

      <Button title="Sign Up" onPress={onSignUpPress} />
    </View>
  );
}