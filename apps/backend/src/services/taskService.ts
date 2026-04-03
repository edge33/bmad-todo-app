import type {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from "@todoapp/shared-types";
import { NotFoundError, ValidationError } from "../middleware/errorHandler.ts";

// In-memory storage for MVP (will use Prisma in production)
const tasks: Task[] = [];
let nextId = 1;

function validateDescription(description: unknown): string {
  if (typeof description !== "string") {
    throw new ValidationError("Task description must be a string");
  }
  if (description.trim().length === 0) {
    throw new ValidationError("Task description cannot be empty");
  }
  return description.trim();
}

export const taskService = {
  getAll(): Task[] {
    return tasks;
  },

  create(req: CreateTaskRequest): Task {
    const description = validateDescription(req.description);

    const task: Task = {
      id: nextId++,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: null,
    };

    tasks.push(task);
    return task;
  },

  update(id: number, req: UpdateTaskRequest): Task {
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundError("Task", id);
    }

    if (req.description !== undefined) {
      const description = validateDescription(req.description);
      task.description = description;
    }

    if (req.completed !== undefined) {
      task.completed = req.completed;
    }

    task.updatedAt = new Date().toISOString();
    return task;
  },

  delete(id: number): void {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundError("Task", id);
    }

    tasks.splice(index, 1);
  },
};
