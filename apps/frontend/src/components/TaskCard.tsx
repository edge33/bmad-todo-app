import type { Task } from "@todoapp/shared-types";
import type React from "react";
import { useUpdateTask } from "../hooks/useUpdateTask.ts";

const checkIcon = (
  <svg
    aria-hidden
    className="h-5 w-5 shrink-0 text-emerald-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <title>Completed</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

type ActiveTaskCardProps = {
  task: Task;
  onCompleteStart?: (taskId: number) => void;
};

export const ActiveTaskCard: React.FC<ActiveTaskCardProps> = ({
  task,
  onCompleteStart,
}) => {
  const { mutate, isPending } = useUpdateTask();

  const handleActivate = () => {
    if (isPending || task.id < 1) {
      return;
    }
    onCompleteStart?.(task.id);
    mutate({ id: task.id, completed: true });
  };

  return (
    <button
      type="button"
      data-testid={`active-task-${task.id}`}
      aria-label={`Mark complete: ${task.description}`}
      disabled={isPending || task.id < 1}
      onClick={handleActivate}
      className="task-card-active flex min-h-[44px] w-full cursor-pointer items-start gap-3 rounded-xl border border-violet-100 bg-[#F5F3FF] p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <span className="min-w-0 flex-1 text-base text-gray-900">
        {task.description}
      </span>
    </button>
  );
};

type CompletedTaskCardProps = {
  task: Task;
  playEntrance: boolean;
};

export const CompletedTaskCard: React.FC<CompletedTaskCardProps> = ({
  task,
  playEntrance,
}) => {
  return (
    <div
      data-testid={`completed-task-${task.id}`}
      className={`task-card-completed flex min-h-[44px] items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 pl-3 opacity-[0.78] ${
        playEntrance ? "task-complete-enter" : ""
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: "#22c55e" }}
    >
      <span className="min-w-0 flex-1 text-base text-[#2d5a3d]">
        {task.description}
      </span>
      <span className="inline-flex shrink-0 text-emerald-800" aria-hidden>
        {checkIcon}
      </span>
    </div>
  );
};
