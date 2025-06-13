import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_TASK_IDENTIFIER = "beto-task";
const MINIMUM_INTERVAL = 15;

export const initializeBackgroundTask = async (
  innerAppMountedPromise: Promise<void>
) => {
  // Note: This needs to be called in the global scope, not in a React component.
  TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
    console.log("Background task started");

    // Delay starting the task until the inner app is mounted
    await innerAppMountedPromise;

    // TODO: Do something here

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
