import * as BackgroundTask from "expo-background-task";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { initializeBackgroundTask } from "@/utils";

// Declare a variable to store the resolver function
let resolver: (() => void) | null;

// Create a promise and store its resolve function for later
const promise = new Promise<void>((resolve) => {
  resolver = resolve;
});

// Pass the promise to the background task, it will wait until the promise resolves
initializeBackgroundTask(promise);

export default function BackgroundTaskScreen() {
  const [status, setStatus] =
    useState<BackgroundTask.BackgroundTaskStatus | null>(null);

  useEffect(() => {
    // Resolve the promise to indicate that the inner app has mounted
    // This allows initializeBackgroundTask to proceed
    if (resolver) {
      resolver();
    }
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background Task Service Availability:{" "}
          <Text style={styles.boldText}>
            {status ? BackgroundTask.BackgroundTaskStatus[status] : null}
          </Text>
        </Text>
      </View>
      <Button
        title="Run Background Task (Debug)"
        onPress={() => BackgroundTask.triggerTaskWorkerForTestingAsync()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
});
