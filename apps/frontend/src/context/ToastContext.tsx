import type React from "react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useCreateTask } from "../hooks/useCreateTask.ts";
import { useUpdateTask } from "../hooks/useUpdateTask.ts";
import { subscribeErrorToast, subscribeUndoToast } from "../lib/toastBridge.ts";

type ToastState =
  | {
      kind: "undo";
      taskId: number;
      action: "complete" | "delete";
      description: string;
    }
  | { kind: "error"; message: string; onRetry?: () => void }
  | null;

function ToastViewport() {
  const [toast, setToast] = useState<ToastState>(null);
  const { mutate: updateTask, isPending: isUpdatePending } = useUpdateTask();
  const { mutate: createTaskMutate, isPending: isCreatePending } =
    useCreateTask();
  const isPending = isUpdatePending || isCreatePending;

  const dismiss = useCallback(() => setToast(null), []);

  useLayoutEffect(
    () =>
      subscribeUndoToast(({ taskId, description, action = "complete" }) =>
        setToast({ kind: "undo", taskId, description, action }),
      ),
    [],
  );

  useLayoutEffect(
    () =>
      subscribeErrorToast((message, onRetry) =>
        setToast(
          onRetry
            ? { kind: "error", message, onRetry }
            : { kind: "error", message },
        ),
      ),
    [],
  );

  useEffect(() => {
    if (!toast || toast.kind !== "undo") return;
    const t = window.setTimeout(dismiss, 6000);
    return () => window.clearTimeout(t);
  }, [toast, dismiss]);

  useEffect(() => {
    if (!toast || toast.kind !== "error") return;
    const t = window.setTimeout(dismiss, 8000);
    return () => window.clearTimeout(t);
  }, [toast, dismiss]);

  if (!toast) return null;

  if (toast.kind === "error") {
    return (
      <div
        role="alert"
        className="fixed bottom-4 left-1/2 z-50 flex max-w-md -translate-x-1/2 items-center gap-3 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-800 shadow-lg dark:border-red-800 dark:bg-slate-800 dark:text-red-300"
      >
        <span>{toast.message}</span>
        {toast.onRetry && (
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] rounded-md bg-indigo-600 px-3 py-2 font-medium text-white"
            onClick={() => {
              toast.onRetry?.();
              dismiss();
            }}
          >
            Retry
          </button>
        )}
        <button
          type="button"
          className="min-h-[44px] min-w-[44px] rounded-md px-2 text-red-700 underline"
          onClick={dismiss}
        >
          Dismiss
        </button>
      </div>
    );
  }

  const label = toast.action === "delete" ? "Task deleted" : "Task completed";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="fixed bottom-4 left-1/2 z-50 flex max-w-md -translate-x-1/2 items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-lg dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
    >
      <span>{label}</span>
      <button
        type="button"
        disabled={isPending}
        className="min-h-[44px] min-w-[44px] cursor-pointer rounded-md bg-indigo-600 px-3 py-2 font-medium text-white disabled:opacity-50"
        onClick={() => {
          if (toast.action === "delete") {
            createTaskMutate(
              { description: toast.description },
              { onSuccess: dismiss },
            );
          } else {
            updateTask(
              { id: toast.taskId, completed: false },
              { onSuccess: dismiss },
            );
          }
        }}
      >
        Undo
      </button>
      <button
        type="button"
        className="min-h-[44px] min-w-[44px] cursor-pointer rounded-md px-2 text-gray-600 underline"
        onClick={dismiss}
      >
        Dismiss
      </button>
    </div>
  );
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    {children}
    <ToastViewport />
  </>
);
