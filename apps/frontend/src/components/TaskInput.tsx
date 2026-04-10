import type React from "react";
import { useState } from "react";
import { useCreateTask } from "../hooks/useCreateTask.ts";

export const TaskInput: React.FC = () => {
  const [value, setValue] = useState("");
  const { mutate: createTask, isPending } = useCreateTask();
  const isDisabled = isPending;

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    const description = value.trim();
    if (!description || isDisabled || description.length > 500) {
      return;
    }
    createTask(
      { description },
      {
        onSuccess: () => {
          setValue("");
        },
      },
    );
  };

  const handleEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setValue("");
    }
  };

  return (
    <>
      <label htmlFor="task-input" className="sr-only">
        Add Task
      </label>
      <input
        id="task-input"
        name="taskDescription"
        type="text"
        placeholder="Add a task..."
        value={value}
        aria-disabled={isDisabled}
        onChange={(e) => !isDisabled && setValue(e.target.value)}
        onKeyDown={(e) => {
          handleSubmit(e);
          handleEscape(e);
        }}
        maxLength={500}
        className="task-input disabled:opacity-60"
      />
    </>
  );
};
