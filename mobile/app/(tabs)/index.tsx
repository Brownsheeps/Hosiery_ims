import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Home() {
  return (
    <View style={{ padding: 20 }}>
      <Text>IMS Home</Text>

      <Link href="/sign-in">Go to Sign In</Link>

      <Link href="/sign-up">Go to Sign Up</Link>
    </View>
  );
}