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
