import axios from 'axios';
import Constants from 'expo-constants';
import { clearToken, getToken } from './auth';

function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri ?? '';
  const host = hostUri.split(':')[0];
  if (host) {
    return `http://${host}:4000`;
  }

  return 'http://localhost:4000';
}

function normalizeApiBaseUrl(url: string): string {
  return url.replace(/\/+$/, '').replace(/\/api$/, '');
}

const API_BASE_URL = normalizeApiBaseUrl(resolveApiBaseUrl());

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const isAuthRoute = config.url?.startsWith('/auth/');
  if (isAuthRoute) {
    return config;
  }

  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearToken();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);
