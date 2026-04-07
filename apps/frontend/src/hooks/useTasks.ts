import { useQuery } from "@tanstack/react-query";
import type { Task } from "@todoapp/shared-types";
import { fetchTasks } from "../services/taskService.ts";
import { taskKeys } from "./queryKeys.ts";

export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: taskKeys.lists(),
    queryFn: fetchTasks,
  });
};
