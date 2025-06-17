# Daily Quotes App

A simple Expo app that fetches and stores a new daily quote in the background using Expo Background Tasks. When users open the app, they instantly see the most recent quote without waiting for a network request.

## Features

- Fetches one inspirational quote per day
- Uses [`expo-background-task`](https://docs.expo.dev/versions/latest/sdk/background-task) to run logic when the app isn't open
- Stores quotes locally with `AsyncStorage`
- Works offline after initial sync
- Compatible with both iOS and Android

## Tech Stack

- [Expo](https://expo.dev/)
- `expo-background-task`
- `expo-async-storage`
- React Native

## How It Works

1. A background task runs when the system allows.
2. It fetches a new quote from a remote API.
3. The quote is saved to local storage.
4. On app launch, the stored quote is shown immediately.

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/daily-quotes-app.git
   ```
2. Install deps
   ```bash
   bun install
   ```
3. Run the app

> [!NOTE]
> For iOS, you must use a physical device as background tasks are not supported in the iOS simulator.

```bash
eas build -p ios --profile development
eas build -p android --profile development
```
