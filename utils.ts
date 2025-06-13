import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_TASK_IDENTIFIER = "fetch-quote-task";
const MINIMUM_INTERVAL = 15;
const QUOTES_HISTORY_KEY = "@quotes_history";
const MAX_HISTORY_ITEMS = 10;

export type Quote = {
  q: string;
  a: string;
  c: string;
  h: string;
  timestamp: number;
};

type QuoteHistory = Quote[];

// Function to store the fetched quote in history
export const storeQuoteInHistory = async (quote: Quote) => {
  try {
    // Get existing history
    const historyJson = await AsyncStorage.getItem(QUOTES_HISTORY_KEY);
    const history: QuoteHistory = historyJson ? JSON.parse(historyJson) : [];

    // Add new quote with timestamp
    const newQuote = {
      ...quote,
      timestamp: Date.now(),
    };

    // Add to beginning of array and limit size
    const updatedHistory = [newQuote, ...history].slice(0, MAX_HISTORY_ITEMS);

    await AsyncStorage.setItem(
      QUOTES_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
    return updatedHistory;
  } catch (error) {
    console.error("Error storing quote:", error);
    return null;
  }
};

// Function to get quote history
export const getQuoteHistory = async (): Promise<QuoteHistory | null> => {
  try {
    const historyJson = await AsyncStorage.getItem(QUOTES_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : null;
  } catch (error) {
    console.error("Error getting quote history:", error);
    return null;
  }
};

export const initializeBackgroundTask = async (
  innerAppMountedPromise: Promise<void>
) => {
  // Note: This needs to be called in the global scope, not in a React component.
  TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
    console.log("Background task started");

    // Delay starting the task until the inner app is mounted
    await innerAppMountedPromise;

    try {
      // Fetch random quote from ZenQuotes API
      const response = await fetch("https://zenquotes.io/api/random");
      const quotes: Quote[] = await response.json();

      if (quotes && quotes.length > 0) {
        // Store the quote in history
        await storeQuoteInHistory(quotes[0]);
        console.log("Background task fetched and stored quote:", quotes[0]);
      }
    } catch (error) {
      console.error("Error in background task:", error);
    }

    console.log("Background task done");
  });

  // Register the task
  if (!(await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER))) {
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
      minimumInterval: MINIMUM_INTERVAL,
    });
    console.log(
      `Background task with ID: ${BACKGROUND_TASK_IDENTIFIER} registered`
    );
  }
};
