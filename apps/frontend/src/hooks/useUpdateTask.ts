import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task, UpdateTaskRequest } from "@todoapp/shared-types";
import { notifyErrorToast, notifyUndoToast } from "../lib/toastBridge.ts";
import { mapErrorToUserMessage, updateTask } from "../services/taskService.ts";
import { taskKeys } from "./queryKeys.ts";

export type UpdateTaskVars = { id: number } & UpdateTaskRequest;

function mapTaskList(
  tasks: Task[] | undefined,
  id: number,
  patch: UpdateTaskRequest,
): Task[] | undefined {
  if (!tasks) {
    return tasks;
  }
  return tasks.map((t) => {
    if (t.id !== id) {
      return t;
    }
    const next: Task = {
      ...t,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    return next;
  });
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...body }: UpdateTaskVars) => updateTask(id, body),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousData = queryClient.getQueryData<Task[]>(taskKeys.lists());
      const { id, ...patch } = vars;
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
        if (old === undefined) {
          return old;
        }
        return mapTaskList(old, id, patch) ?? [];
      });
      return { previousData };
    },
    onError: (error, vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(taskKeys.lists(), context.previousData);
      }
      if (import.meta.env.DEV) {
        console.error("[useUpdateTask] mutation error:", error);
      }
      notifyErrorToast(mapErrorToUserMessage(error), () =>
        mutation.mutate(vars),
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      if (variables.completed === true) {
        notifyUndoToast({
          taskId: data.id,
          description: data.description,
          action: "complete",
        });
      }
    },
  });
  return mutation;
};
