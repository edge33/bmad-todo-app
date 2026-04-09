import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@todoapp/shared-types";
import { notifyErrorToast, notifyUndoToast } from "../lib/toastBridge.ts";
import { deleteTask, mapErrorToUserMessage } from "../services/taskService.ts";
import { taskKeys } from "./queryKeys.ts";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousData = queryClient.getQueryData<Task[]>(taskKeys.lists());
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );
      return { previousData };
    },
    onError: (error, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(taskKeys.lists(), context.previousData);
      }
      if (import.meta.env.DEV) {
        console.error("[useDeleteTask] mutation error:", error);
      }
      notifyErrorToast(mapErrorToUserMessage(error), () => mutation.mutate(id));
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
  return mutation;
};
