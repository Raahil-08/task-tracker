# Task Tracker Mobile (Expo)

React Native mobile client for the Task Tracker backend, built with Expo, TypeScript, Expo Router, Axios, and TanStack Query.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env
```

3. Start development server:

```bash
npm run start
```

## API URL Configuration

- Development default: `http://localhost:4000` (from `.env.example`)
- Set `EXPO_PUBLIC_API_URL` in `.env` for your backend host
- For production builds, set `EXPO_PUBLIC_API_URL` to your production API origin

## Run On Phone (Expo Go)

```bash
npm install
cp .env.example .env
npm run start
```

Then:
- Install Expo Go on your phone
- Ensure phone and computer are on the same network
- Scan the QR code from the terminal with Expo Go
