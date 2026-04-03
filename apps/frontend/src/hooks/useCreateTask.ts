import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskRequest, Task } from "@todoapp/shared-types";
import { taskKeys } from "./queryKeys.ts";

/**
 * Example mutation hook demonstrating three-phase optimistic update pattern:
 * 1. Snapshot: Cancel queries and save previous data
 * 2. Update: Apply optimistic changes immediately
 * 3. Rollback: Restore previous data if error occurs
 *
 * This pattern ensures responsive UX while maintaining data consistency.
 */

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskRequest): Promise<Task> => {
      // Validate input
      if (!input.description?.trim()) {
        throw new Error("Task description cannot be empty");
      }

      // This would call the actual API in a real implementation
      // const response = await fetch('/api/tasks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(input),
      // })
      // return response.json()

      // For now, simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Math.floor(Date.now() + Math.random() * 1000),
            description: input.description,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: null,
          });
        }, 500);
      });
    },
    // PHASE 1: Snapshot previous state
    onMutate: async (newTask) => {
      // Cancel any pending queries for task lists to prevent race conditions
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      // Snapshot the previous data for rollback
      const previousData = queryClient.getQueryData<Task[]>(taskKeys.lists());

      // PHASE 2: Optimistically update the cache
      if (previousData) {
        const optimisticTask: Task = {
          id: -1, // Temporary ID until server responds
          description: newTask.description,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: null,
        };
        queryClient.setQueryData(taskKeys.lists(), [
          ...previousData,
          optimisticTask,
        ]);
      } else {
        console.warn(
          "No task list data available for optimistic update. User will not see feedback until API responds.",
        );
      }

      // Return context for error handler
      return { previousData };
    },
    // PHASE 3: Rollback on error
    onError: (error, _newTask, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(taskKeys.lists(), context.previousData);
      }
      // In a real app, show error toast notification here
      console.error("Failed to create task:", error);
    },
    // Invalidate queries on success to refetch fresh data
    onSuccess: () => {
      try {
        queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      } catch (error) {
        console.error("Failed to invalidate cache:", error);
      }
    },
  });
};
