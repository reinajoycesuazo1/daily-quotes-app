import { Stack } from "expo-router";
import { Button } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => <Button title="Test" onPress={() => {}} />,
      }}
    />
  );
}
