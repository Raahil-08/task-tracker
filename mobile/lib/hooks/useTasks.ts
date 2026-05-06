import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '../apiClient';
import { ApiError, Task, TaskResponse, TasksResponse } from '../../types/api';

interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
}

interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string | null;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message ?? "Couldn't connect - check your internet";
  }
  return 'Something went wrong. Please try again.';
}

export function useTasks() {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<TasksResponse>('/tasks');
        return response.data.tasks;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: async (payload) => {
      try {
        const response = await apiClient.post<TaskResponse>('/tasks', payload);
        return response.data.task;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, UpdateTaskInput>({
    mutationFn: async ({ id, ...payload }) => {
      try {
        const response = await apiClient.patch<TaskResponse>(`/tasks/${id}`, payload);
        return response.data.task;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      try {
        await apiClient.delete(`/tasks/${id}`);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
