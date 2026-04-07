import type { Task } from "@todoapp/shared-types";
import type React from "react";
import { useUpdateTask } from "../hooks/useUpdateTask.ts";
import { formatRelativeTime } from "../lib/formatDate.ts";

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

const trashIcon = (
  <svg
    aria-hidden
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <title>Delete</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

type ActiveTaskCardProps = {
  task: Task;
  onCompleteStart?: (taskId: number) => void;
  onDelete: (id: number) => void;
};

export const ActiveTaskCard: React.FC<ActiveTaskCardProps> = ({
  task,
  onCompleteStart,
  onDelete,
}) => {
  const { mutate, isPending } = useUpdateTask();

  const handleActivate = () => {
    if (isPending || task.id < 1) {
      return;
    }
    onCompleteStart?.(task.id);
    mutate({ id: task.id, completed: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Delete") {
      e.preventDefault();
      onDelete(task.id);
    }
  };

  return (
    <div className="group relative">
      <button
        type="button"
        data-testid={`active-task-${task.id}`}
        aria-label={`Mark complete: ${task.description}`}
        disabled={isPending || task.id < 1}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className="task-card-active flex min-h-[44px] w-full cursor-pointer items-start gap-3 rounded-xl border border-violet-100 bg-[#F5F3FF] p-4 text-left transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <div className="min-w-0 flex-1">
          <span className="block text-base text-gray-900">
            {task.description}
          </span>
          <time dateTime={task.createdAt} className="text-sm text-gray-400">
            {formatRelativeTime(task.createdAt)}
          </time>
        </div>
        <div className="w-10 shrink-0" />
      </button>
      <button
        type="button"
        aria-label={`Delete task: ${task.description}`}
        data-testid={`delete-task-${task.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute right-3 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity hover:text-red-500 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        {trashIcon}
      </button>
    </div>
  );
};

type CompletedTaskCardProps = {
  task: Task;
  playEntrance: boolean;
  onDelete: (id: number) => void;
};

export const CompletedTaskCard: React.FC<CompletedTaskCardProps> = ({
  task,
  playEntrance,
  onDelete,
}) => {
  return (
    <div className="group relative">
      <article
        data-testid={`completed-task-${task.id}`}
        className={`task-card-completed flex min-h-[44px] items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 pl-3 opacity-[0.78] transition-shadow hover:shadow-md ${
          playEntrance ? "task-complete-enter" : ""
        }`}
        style={{ borderLeftWidth: 4, borderLeftColor: "#22c55e" }}
      >
        <div className="min-w-0 flex-1">
          <span className="block text-base text-[#2d5a3d]">
            {task.description}
          </span>
          <time dateTime={task.createdAt} className="text-sm text-[#5a8a6d]">
            {formatRelativeTime(task.createdAt)}
          </time>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex shrink-0 text-emerald-800" aria-hidden>
            {checkIcon}
          </span>
          <div className="w-10" />
        </div>
      </article>
      <button
        type="button"
        aria-label={`Delete task: ${task.description}`}
        data-testid={`delete-task-${task.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute right-3 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity hover:text-red-500 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        {trashIcon}
      </button>
    </div>
  );
};
