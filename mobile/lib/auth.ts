import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'task-tracker-token';
let memoryToken: string | null = null;

function hasSecureStoreApi(): boolean {
  return (
    typeof SecureStore.getItemAsync === 'function' &&
    typeof SecureStore.setItemAsync === 'function' &&
    typeof SecureStore.deleteItemAsync === 'function'
  );
}

async function getWebToken(): Promise<string | null> {
  if (typeof localStorage === 'undefined') {
    return memoryToken;
  }
  return localStorage.getItem(TOKEN_KEY);
}

async function setWebToken(token: string): Promise<void> {
  memoryToken = token;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

async function clearWebToken(): Promise<void> {
  memoryToken = null;
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web' || !hasSecureStoreApi()) {
    return getWebToken();
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (Platform.OS === 'web' || !hasSecureStoreApi()) {
    await setWebToken(token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  if (Platform.OS === 'web' || !hasSecureStoreApi()) {
    await clearWebToken();
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
