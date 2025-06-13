import React from "react";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
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

// Debugging
TaskManager.getRegisteredTasksAsync().then((tasks) => {
  console.log(tasks);
});

import { initializeBackgroundTask, getQuoteHistory, Quote } from "@/utils";

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
  const [quoteHistory, setQuoteHistory] = useState<Quote[]>([]);
  const appState = useRef(AppState.currentState);

  const loadQuoteHistory = async () => {
    const history = await getQuoteHistory();
    if (history) {
      setQuoteHistory(history);
    }
  };

  useEffect(() => {
    // Resolve the promise to indicate that the inner app has mounted
    if (resolver) {
      resolver();
    }

    // Load initial data
    loadQuoteHistory();

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
          loadQuoteHistory();
        }
        if (appState.current.match(/active/) && nextAppState === "background") {
          console.log("App has gone to the background!");
        }
        appState.current = nextAppState;
      }
    );

    // Cleanup subscription on unmount
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  const renderQuote = (quote: Quote, isPrevious: boolean = false) => (
    <View style={[styles.quoteContainer, isPrevious && styles.previousQuote]}>
      <Text style={styles.quoteText}>"{quote.q}"</Text>
      <Text style={styles.authorText}>- {quote.a}</Text>
      <Text style={styles.timestamp}>
        {new Date(quote.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background Task Service Availability:{" "}
          <Text style={styles.boldText}>
            {status ? BackgroundTask.BackgroundTaskStatus[status] : null}
          </Text>
        </Text>
      </View>

      <View style={styles.quotesContainer}>
        <Text style={styles.sectionTitle}>Latest Quote:</Text>
        {quoteHistory.length > 0 ? (
          renderQuote(quoteHistory[0])
        ) : (
          <Text>No quotes available yet</Text>
        )}

        {quoteHistory.length > 1 && (
          <>
            <Text style={[styles.sectionTitle, styles.previousTitle]}>
              Previous Quote:
            </Text>
            {renderQuote(quoteHistory[1], true)}
          </>
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
  },
  quotesContainer: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  previousTitle: {
    marginTop: 20,
  },
  quoteContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  previousQuote: {
    backgroundColor: "#e8e8e8",
    opacity: 0.8,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 8,
  },
  authorText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
});
