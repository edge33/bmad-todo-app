import type React from "react";
import { useDeleteTask } from "../hooks/useDeleteTask.ts";
import { useTasks } from "../hooks/useTasks.ts";
import { ErrorMessage } from "./ErrorMessage.tsx";
import { LoadingSpinner } from "./LoadingSpinner.tsx";
import { CompletedTaskCard } from "./TaskCard.tsx";

type CompletedSectionProps = {
  entranceTaskId?: number | null;
};

export const CompletedSection: React.FC<CompletedSectionProps> = ({
  entranceTaskId = null,
}) => {
  const { data: tasks, isLoading, error } = useTasks();
  const { mutate: deleteTask } = useDeleteTask();

  if (isLoading) {
    return (
      <section className="space-y-3" aria-busy="true">
        <h2 className="text-lg font-bold text-task-text-heading dark:text-slate-100">
          {"✨ Completed"}
        </h2>
        <LoadingSpinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-task-text-heading dark:text-slate-100">
          {"✨ Completed"}
        </h2>
        <ErrorMessage error={error} />
      </section>
    );
  }

  const completed = (tasks ?? [])
    .filter((t) => t.completed)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  return (
    <section className="space-y-3" aria-label="Completed tasks">
      <h2 className="text-lg font-bold text-task-text-heading dark:text-slate-100">
        {"✨ Completed"}
      </h2>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {completed.length === 0
          ? "No completed tasks"
          : `${completed.length} completed ${completed.length === 1 ? "task" : "tasks"}`}
      </div>
      {completed.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center text-gray-500 dark:bg-slate-800 dark:text-slate-400">
          No completed tasks yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {completed.map((task) => (
            <li key={task.id}>
              <CompletedTaskCard
                task={task}
                playEntrance={entranceTaskId === task.id}
                onDelete={deleteTask}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
