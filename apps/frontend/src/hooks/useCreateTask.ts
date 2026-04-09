import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskRequest, Task } from "@todoapp/shared-types";
import { notifyErrorToast } from "../lib/toastBridge.ts";
import { createTask, mapErrorToUserMessage } from "../services/taskService.ts";
import { taskKeys } from "./queryKeys.ts";

/**
 * Create task mutation with three-phase optimistic update:
 * snapshot → optimistic append → rollback on error → invalidate on success.
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    retry: 0,
    mutationFn: (input: CreateTaskRequest) =>
      createTask({ description: input.description.trim() }),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousData = queryClient.getQueryData<Task[]>(taskKeys.lists());

      const optimisticTask: Task = {
        id: -1,
        description: newTask.description.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: null,
      };

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => [
        ...(old ?? []),
        optimisticTask,
      ]);

      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(taskKeys.lists(), context.previousData);
      }
      if (import.meta.env.DEV) {
        console.error("[useCreateTask] mutation error:", error);
      }
      notifyErrorToast(mapErrorToUserMessage(error), () =>
        mutation.mutate(variables),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  return mutation;
};
