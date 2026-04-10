export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: number) {
    super(`${resource} with ID ${id} not found`);
    this.name = "NotFoundError";
  }
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface ErrorContext {
  action: string;
  taskId?: number;
}

export function errorHandler(
  error: unknown,
  context?: ErrorContext,
): {
  status: number;
  body: ErrorResponse;
} {
  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: error.message,
        },
      },
    };
  }

  if (error instanceof NotFoundError) {
    return {
      status: 404,
      body: {
        error: {
          code: "NOT_FOUND",
          message: error.message,
        },
      },
    };
  }

  // Log full error details server-side only — never expose to client
  const logEntry: Record<string, unknown> = {
    err:
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : String(error),
    ...(context?.action !== undefined ? { action: context.action } : {}),
    ...(context?.taskId !== undefined ? { taskId: context.taskId } : {}),
  };
  console.error(logEntry, "Internal server error");

  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
    },
  };
}
