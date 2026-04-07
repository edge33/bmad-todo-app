import type React from "react";
import { useState } from "react";
import { useCreateTask } from "../hooks/useCreateTask.ts";

export const TaskInput: React.FC = () => {
  const [value, setValue] = useState("");
  const { mutate: createTask, isPending } = useCreateTask();

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    const description = value.trim();
    if (!description || isPending) {
      return;
    }
    createTask(
      { description },
      {
        onSuccess: () => setValue(""),
      },
    );
  };

  const handleEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setValue("");
    }
  };

  return (
    <input
      id="task-input"
      name="taskDescription"
      type="text"
      placeholder="Add a task..."
      value={value}
      disabled={isPending}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        handleSubmit(e);
        handleEscape(e);
      }}
      className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:opacity-60"
      aria-label="Add task description"
    />
  );
};
