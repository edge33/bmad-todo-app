import type {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from "@todoapp/shared-types";

const TASKS_PATH = "/api/tasks";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function mapErrorToUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "VALIDATION_ERROR" || error.status === 400) {
      return "Please check your input and try again";
    }
    if (error.code === "NOT_FOUND" || error.status === 404) {
      return "This task no longer exists";
    }
  }
  return "Something went wrong. Please try again.";
}

async function parseResponseError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as {
      error?: { code?: string; message?: string };
    };
    const msg = body.error?.message ?? res.statusText;
    return new ApiError(res.status, msg, body.error?.code);
  } catch {
    return new ApiError(res.status, res.statusText || "Request failed");
  }
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(TASKS_PATH);
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<Task[]>;
}

export async function createTask(body: CreateTaskRequest): Promise<Task> {
  const res = await fetch(TASKS_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<Task>;
}

export async function updateTask(
  id: number,
  body: UpdateTaskRequest,
): Promise<Task> {
  const res = await fetch(`${TASKS_PATH}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<Task>;
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${TASKS_PATH}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
}
