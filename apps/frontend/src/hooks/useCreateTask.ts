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

      const tempId = -Date.now();
      const optimisticTask: Task = {
        id: tempId,
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

      return { previousData, tempId };
    },
    onError: (error, variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(taskKeys.lists(), context.previousData);
      } else {
        // No previous data (e.g. initial fetch failed) — remove the
        // optimistic entry by filtering out temp ids.
        queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
          old ? old.filter((t) => t.id > 0) : [],
        );
      }
      if (import.meta.env.DEV) {
        console.error("[useCreateTask] mutation error:", error);
      }
      notifyErrorToast(mapErrorToUserMessage(error), () =>
        mutation.mutate(variables),
      );
    },
    onSuccess: (data, _vars, context) => {
      // Merge server data but keep the temp id so the React key (task.id)
      // stays stable — avoids unmount/remount that would break focus.
      const tempId = context?.tempId;
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old
          ? old.map((t) => (t.id === tempId ? { ...data, id: tempId } : t))
          : [data],
      );
    },
    onSettled: () => {
      // Background refetch to converge temp ids to real server ids.
      // Runs after both success and error, so the cache eventually
      // reflects the true server state.
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  return mutation;
};
