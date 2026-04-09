import type React from "react";
import { useDeleteTask } from "../hooks/useDeleteTask.ts";
import { useTasks } from "../hooks/useTasks.ts";
import { ErrorMessage } from "./ErrorMessage.tsx";
import { LoadingSpinner } from "./LoadingSpinner.tsx";
import { ActiveTaskCard } from "./TaskCard.tsx";

type TasksSectionProps = {
  onCompleteStart?: (taskId: number) => void;
};

export const TasksSection: React.FC<TasksSectionProps> = ({
  onCompleteStart,
}) => {
  const { data: tasks, isLoading, error } = useTasks();
  const { mutate: deleteTask } = useDeleteTask();

  if (isLoading) {
    return (
      <section className="space-y-3" aria-busy="true">
        <h2 className="text-lg font-bold text-[#2c2c2c] dark:text-slate-100">
          {"📝 Your Tasks"}
        </h2>
        <LoadingSpinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#2c2c2c] dark:text-slate-100">
          {"📝 Your Tasks"}
        </h2>
        <ErrorMessage error={error} />
      </section>
    );
  }

  const active = (tasks ?? []).filter((t) => !t.completed);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-[#2c2c2c] dark:text-slate-100">
        {"📝 Your Tasks"}
      </h2>
      {active.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center text-gray-400 dark:bg-slate-800 dark:text-slate-400">
          No tasks yet. Add one to get started.
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {active.map((task) => (
            <li key={task.id}>
              <ActiveTaskCard
                task={task}
                onDelete={deleteTask}
                {...(onCompleteStart ? { onCompleteStart } : {})}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
