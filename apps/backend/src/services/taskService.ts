import type {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from "@todoapp/shared-types";
import { prisma } from "../db/prisma.ts";
import type { Task as PrismaTask } from "../generated/prisma/client.ts";
import { NotFoundError, ValidationError } from "../middleware/errorHandler.ts";

function isPrismaNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2025"
  );
}

function formatTask(prismaTask: PrismaTask): Task {
  return {
    ...prismaTask,
    createdAt: prismaTask.createdAt.toISOString(),
    updatedAt: prismaTask.updatedAt.toISOString(),
  };
}

function validateDescription(description: unknown): string {
  if (typeof description !== "string") {
    throw new ValidationError("Task description must be a string");
  }
  const trimmed = description.trim();
  if (trimmed.length === 0) {
    throw new ValidationError("Task description cannot be empty");
  }
  if (trimmed.length > 500) {
    throw new ValidationError(
      "Task description must be 500 characters or fewer",
    );
  }
  return trimmed;
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return tasks.map(formatTask);
  },

  async getById(id: number): Promise<Task> {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundError("Task", id);
    }
    return formatTask(task);
  },

  async create(req: CreateTaskRequest): Promise<Task> {
    const description = validateDescription(req.description);
    const task = await prisma.task.create({
      data: { description },
    });
    return formatTask(task);
  },

  async update(id: number, req: UpdateTaskRequest): Promise<Task> {
    if (req.description === undefined && req.completed === undefined) {
      throw new ValidationError(
        "At least one field (description or completed) must be provided",
      );
    }

    const data: { description?: string; completed?: boolean } = {};

    if (req.description !== undefined) {
      data.description = validateDescription(req.description);
    }

    if (req.completed !== undefined) {
      if (typeof req.completed !== "boolean") {
        throw new ValidationError("completed must be a boolean");
      }
      data.completed = req.completed;
    }

    try {
      const task = await prisma.task.update({ where: { id }, data });
      return formatTask(task);
    } catch (error: unknown) {
      if (isPrismaNotFound(error)) {
        throw new NotFoundError("Task", id);
      }
      throw error;
    }
  },

  async delete(id: number): Promise<Task> {
    try {
      const task = await prisma.task.delete({ where: { id } });
      return formatTask(task);
    } catch (error: unknown) {
      if (isPrismaNotFound(error)) {
        throw new NotFoundError("Task", id);
      }
      throw error;
    }
  },
};
