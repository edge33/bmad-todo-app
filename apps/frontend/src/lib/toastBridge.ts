export type UndoToastPayload = { taskId: number; description: string };

type UndoListener = (payload: UndoToastPayload) => void;
type ErrorListener = (message: string) => void;

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

export function notifyErrorToast(message: string): void {
  errorListener?.(message);
}
