import * as BackgroundTask from "expo-background-task";
import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  AppState,
  AppStateStatus,
} from "react-native";

import { initializeBackgroundTask, getFetchedData } from "@/utils";

// Declare a variable to store the resolver function
let resolver: (() => void) | null;

// Create a promise and store its resolve function for later
const promise = new Promise<void>((resolve) => {
  resolver = resolve;
});

// Pass the promise to the background task, it will wait until the promise resolves
initializeBackgroundTask(promise);

type BackgroundTaskData = {
  timestamp: number;
  data: any;
};

export default function BackgroundTaskScreen() {
  const [status, setStatus] =
    useState<BackgroundTask.BackgroundTaskStatus | null>(null);
  const [fetchedData, setFetchedData] = useState<BackgroundTaskData | null>(
    null
  );
  const appState = useRef(AppState.currentState);

  const loadInitialData = async () => {
    const data = await getFetchedData();
    if (data) {
      setFetchedData({
        timestamp: Date.now(),
        data,
      });
    }
  };

  useEffect(() => {
    // Resolve the promise to indicate that the inner app has mounted
    if (resolver) {
      resolver();
    }

    // Load initial data
    loadInitialData();

    // Subscribe to app state changes
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // App has come to the foreground
          console.log("App has come to the foreground!");
          loadInitialData();
        }
        appState.current = nextAppState;
      }
    );

    // Cleanup subscription on unmount
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background Task Service Availability:{" "}
          <Text style={styles.boldText}>
            {status ? BackgroundTask.BackgroundTaskStatus[status] : null}
          </Text>
        </Text>
        {fetchedData && (
          <Text style={styles.timestamp}>
            Last updated: {new Date(fetchedData.timestamp).toLocaleString()}
          </Text>
        )}
      </View>

      <View style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>Fetched Data:</Text>
        {fetchedData ? (
          <View style={styles.dataContent}>
            <Text style={styles.boldText}>Title:</Text>
            <Text>{fetchedData.data.title}</Text>
            <Text style={styles.boldText}>Body:</Text>
            <Text>{fetchedData.data.body}</Text>
          </View>
        ) : (
          <Text>No data available yet</Text>
        )}
      </View>

      <Button
        title="Run Background Task (Debug)"
        onPress={() => BackgroundTask.triggerTaskWorkerForTestingAsync()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: "bold",
    marginTop: 10,
  },
  dataContainer: {
    margin: 10,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dataContent: {
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});
