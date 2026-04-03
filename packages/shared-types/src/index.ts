export interface Task {
  id: number;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: null;
}

export interface CreateTaskRequest {
  description: string;
}

export interface UpdateTaskRequest {
  description?: string;
  completed?: boolean;
}

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export interface ErrorResponse {
  error: {
    code: keyof typeof ERROR_CODES;
    message: string;
  };
}
