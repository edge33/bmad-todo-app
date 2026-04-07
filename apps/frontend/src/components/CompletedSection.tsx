import type React from "react";
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

  if (isLoading) {
    return (
      <section className="space-y-3" aria-busy="true">
        <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
        <LoadingSpinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
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
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
      {completed.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center text-gray-400">
          No completed tasks yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {completed.map((task) => (
            <li key={task.id}>
              <CompletedTaskCard
                task={task}
                playEntrance={entranceTaskId === task.id}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
