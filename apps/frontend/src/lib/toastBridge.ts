export type UndoToastPayload = {
  taskId: number;
  description: string;
  action?: "complete" | "delete";
};
export type RetryFn = () => void;

type UndoListener = (payload: UndoToastPayload) => void;
type ErrorListener = (message: string, onRetry?: RetryFn) => void;

let undoListener: UndoListener | null = null;
let errorListener: ErrorListener | null = null;

export function subscribeUndoToast(listener: UndoListener): () => void {
  undoListener = listener;
  return () => {
    undoListener = null;
  };
}

export function subscribeErrorToast(listener: ErrorListener): () => void {
  errorListener = listener;
  return () => {
    errorListener = null;
  };
}

export function notifyUndoToast(payload: UndoToastPayload): void {
  undoListener?.(payload);
}

export function notifyErrorToast(message: string, onRetry?: RetryFn): void {
  errorListener?.(message, onRetry);
}
