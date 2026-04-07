import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@todoapp/shared-types";
import { notifyErrorToast, notifyUndoToast } from "../lib/toastBridge.ts";
import { deleteTask } from "../services/taskService.ts";
import { taskKeys } from "./queryKeys.ts";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousData = queryClient.getQueryData<Task[]>(taskKeys.lists());
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );
      return { previousData };
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(taskKeys.lists(), context.previousData);
      }
      const message =
        error instanceof Error ? error.message : "Failed to delete task.";
      notifyErrorToast(message);
    },
    onSuccess: (_data, id, context) => {
      const deletedTask = context?.previousData?.find((t) => t.id === id);
      if (deletedTask) {
        notifyUndoToast({
          taskId: id,
          description: deletedTask.description,
          action: "delete",
        });
      }
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
