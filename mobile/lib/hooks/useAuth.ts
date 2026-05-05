import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '../apiClient';
import { AuthResponse, ApiError } from '../../types/api';

interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

function extractApiErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as Record<string, unknown>;

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error;
  }

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const firstError = payload.errors[0];
    if (typeof firstError === 'string' && firstError.trim()) {
      return firstError;
    }
    if (
      firstError &&
      typeof firstError === 'object' &&
      typeof (firstError as Record<string, unknown>).message === 'string'
    ) {
      return (firstError as Record<string, string>).message;
    }
  }

  return null;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const status = error.response?.status;
    const apiMessage = extractApiErrorMessage(error.response?.data);

    if (apiMessage) {
      return apiMessage;
    }

    if (status === 401) {
      return 'Invalid email or password.';
    }

    if (!error.response) {
      return "Couldn't connect - check your internet";
    }

    return 'Request failed. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: async (payload) => {
      try {
        const response = await apiClient.post<AuthResponse>('/auth/login', payload);
        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}

export function useSignup() {
  return useMutation<AuthResponse, Error, SignupInput>({
    mutationFn: async (payload) => {
      try {
        const response = await apiClient.post<AuthResponse>('/auth/signup', payload);
        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}

export function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: async () => Promise.resolve(),
  });
}
