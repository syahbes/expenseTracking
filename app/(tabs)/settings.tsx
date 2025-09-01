//forth tab screen for settings

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function Settings() {
  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Settings</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
