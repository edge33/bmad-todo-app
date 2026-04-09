import type {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from "@todoapp/shared-types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  errorHandler,
  ValidationError,
} from "../../middleware/errorHandler.ts";
import { taskService } from "../../services/taskService.ts";

export default async function (fastify: FastifyInstance) {
  // GET / - returns all tasks
  fastify.get<{ Reply: Task[] }>(
    "/",
    async (_req: FastifyRequest<{ Reply: Task[] }>, reply: FastifyReply) => {
      try {
        const tasks = await taskService.getAll();
        return tasks;
      } catch (error) {
        const { status, body } = errorHandler(error);
        return reply.status(status).send(body);
      }
    },
  );

  // GET /:id - returns a single task by ID
  fastify.get<{ Params: { id: string }; Reply: Task }>(
    "/:id",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (
          Number.isNaN(id) ||
          id < 1 ||
          !Number.isInteger(Number(req.params.id))
        ) {
          throw new ValidationError("Task ID must be a positive integer");
        }

        const task = await taskService.getById(id);
        return task;
      } catch (error) {
        const { status, body } = errorHandler(error);
        return reply.status(status).send(body);
      }
    },
  );

  // POST / - creates a new task
  fastify.post<{ Body: CreateTaskRequest; Reply: Task }>(
    "/",
    async (
      req: FastifyRequest<{ Body: CreateTaskRequest }>,
      reply: FastifyReply,
    ) => {
      try {
        const task = await taskService.create(req.body);
        reply.status(201);
        return task;
      } catch (error) {
        const { status, body } = errorHandler(error);
        return reply.status(status).send(body);
      }
    },
  );

  // PATCH /:id - updates an existing task
  fastify.patch<{
    Params: { id: string };
    Body: UpdateTaskRequest;
    Reply: Task;
  }>(
    "/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: UpdateTaskRequest }>,
      reply: FastifyReply,
    ) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (
          Number.isNaN(id) ||
          id < 1 ||
          !Number.isInteger(Number(req.params.id))
        ) {
          throw new ValidationError("Task ID must be a positive integer");
        }

        const task = await taskService.update(id, req.body);
        return task;
      } catch (error) {
        const { status, body } = errorHandler(error);
        return reply.status(status).send(body);
      }
    },
  );

  // DELETE /:id - deletes an existing task
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (
          Number.isNaN(id) ||
          id < 1 ||
          !Number.isInteger(Number(req.params.id))
        ) {
          throw new ValidationError("Task ID must be a positive integer");
        }

        const deleted = await taskService.delete(id);
        return deleted;
      } catch (error) {
        const { status, body } = errorHandler(error);
        return reply.status(status).send(body);
      }
    },
  );
}
