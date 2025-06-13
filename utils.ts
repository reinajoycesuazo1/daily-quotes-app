import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_TASK_IDENTIFIER = "beto-task";
const MINIMUM_INTERVAL = 15;
const FETCHED_DATA_KEY = "@background_task_data";

// Function to store the fetched data
export const storeFetchedData = async (data: any) => {
  try {
    await AsyncStorage.setItem(FETCHED_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

// Function to get the fetched data
export const getFetchedData = async () => {
  try {
    const data = await AsyncStorage.getItem(FETCHED_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting data:", error);
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
      // Make a fetch request to a public API (example using JSONPlaceholder)
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${Math.floor(
          Math.random() * 100
        )}`
      );
      const data = await response.json();

      // Store the fetched data
      await storeFetchedData(data);
      console.log("Background task fetched and stored data:", data);
    } catch (error) {
      console.error("Error in background task:", error);
    }

    console.log("Background task done");
  });

  // Register the task
  if (!(await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER))) {
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
      // minimumInterval: MINIMUM_INTERVAL,
    });
    console.log(
      `Background task with ID: ${BACKGROUND_TASK_IDENTIFIER} registered`
    );
  }
};
