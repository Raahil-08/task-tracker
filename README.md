# Task Tracker

A full-stack mobile application for tracking tasks and upcoming deadlines, built with React Native (Expo) and a Node.js Express backend.

## Demo Video

![Task Tracker Demo](./Task%20Tracker.mov)

## Setup & Installation

Follow these steps to run the application locally.

### 1. Backend

The backend is built with Node.js, Express, and SQLite. **It is currently deployed and hosted on Render**, meaning you do not need to run the backend locally to use the mobile app.

*However, if you wish to run the backend locally for development:*

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend server will start running on `http://localhost:4000`.*

4. **Important:** You must also update the mobile app's `.env` file (`mobile/.env`) to point to your local backend instead of Render:
   ```env
   # Change this (Render - production):
   EXPO_PUBLIC_API_URL=https://task-tracker-x81b.onrender.com/api

   # To this (Local - development):
   EXPO_PUBLIC_API_URL=http://localhost:4000/api
   ```
   Then restart the Expo dev server for the change to take effect.

### 2. Mobile Frontend Setup

The frontend is a cross-platform mobile application built with React Native and Expo.

1. Open a **new** terminal window and navigate to the `mobile` directory:
   ```bash
   cd mobile
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```
4. Use the **Expo Go** app on your iOS or Android device to scan the QR code displayed in the terminal to open the app.
   *(Alternatively, you can press `i` in the terminal to open the iOS Simulator, or `a` to open the Android Emulator if you have them installed).*