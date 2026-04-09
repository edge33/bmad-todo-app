import { useIsMutating } from "@tanstack/react-query";
import type { Task } from "@todoapp/shared-types";
import type React from "react";
import { useUpdateTask } from "../hooks/useUpdateTask.ts";
import { formatRelativeTime } from "../lib/formatDate.ts";

const spinnerIcon = (
  <svg
    aria-hidden
    className="h-4 w-4 animate-spin text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
  >
    <title>Loading</title>
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
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
  const isMutating = useIsMutating() > 0;
  const isBlocked = isMutating || task.id < 1;

  const handleActivate = () => {
    if (isBlocked) return;
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
        disabled={isBlocked}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className="task-card-active flex min-h-[44px] w-full cursor-pointer items-start gap-3 rounded-[10px] bg-white px-4 py-[14px] text-left shadow-sm transition-all hover:translate-x-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-60 dark:bg-slate-700 dark:shadow-slate-900/20 dark:text-slate-100"
      >
        <div className="min-w-0 flex-1">
          <span className="block truncate text-base text-[#4a4a4a] dark:text-slate-100">
            {task.description}
          </span>
          <time
            dateTime={task.createdAt}
            className="text-sm text-gray-500 dark:text-slate-400"
          >
            {formatRelativeTime(task.createdAt)}
          </time>
        </div>
        <div className="flex w-10 shrink-0 items-center justify-center">
          {isPending && spinnerIcon}
        </div>
      </button>
      <button
        type="button"
        aria-label={`Delete task: ${task.description}`}
        data-testid={`delete-task-${task.id}`}
        disabled={isBlocked}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute right-3 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity hover:text-red-500 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-30 [@media(hover:none)]:opacity-100"
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
  const isMutating = useIsMutating() > 0;

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={`Completed task: ${task.description}`}
        data-testid={`completed-task-${task.id}`}
        className={`task-card-completed flex min-h-[44px] w-full cursor-default items-center gap-3 rounded-[10px] bg-white px-4 py-[14px] pl-3 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-slate-800 ${
          playEntrance ? "task-complete-enter" : ""
        }`}
        style={{ borderLeftWidth: 4, borderLeftColor: "#22c55e" }}
      >
        <span className="shrink-0 text-lg" aria-hidden>
          ✅
        </span>
        <div className="min-w-0 flex-1">
          <span className="block truncate text-base font-medium text-[#2d5a3d] dark:text-emerald-300">
            {task.description}
          </span>
          <time
            dateTime={task.createdAt}
            className="text-sm text-[#3d7a5a] dark:text-emerald-400"
          >
            {formatRelativeTime(task.createdAt)}
          </time>
        </div>
        <div className="w-10 shrink-0" />
      </button>
      <button
        type="button"
        aria-label={`Delete task: ${task.description}`}
        data-testid={`delete-task-${task.id}`}
        disabled={isMutating}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute right-3 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity hover:text-red-500 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-30 [@media(hover:none)]:opacity-100"
      >
        {trashIcon}
      </button>
    </div>
  );
};
