import { useIsMutating } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { useCreateTask } from "../hooks/useCreateTask.ts";

export const TaskInput: React.FC = () => {
  const [value, setValue] = useState("");
  const { mutate: createTask, isPending } = useCreateTask();
  const isMutating = useIsMutating() > 0;
  const isDisabled = isPending || isMutating;

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
        disabled={isDisabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          handleSubmit(e);
          handleEscape(e);
        }}
        maxLength={500}
        className="w-full rounded-[10px] border-2 border-dashed border-[#6366f1] bg-white px-3.5 py-3 text-base text-[#4a4a4a] transition focus:border-solid focus:border-[#6366f1] focus:ring-[4px] focus:ring-indigo-500/10 focus:outline-none disabled:opacity-60 dark:border-indigo-400 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
        aria-label="Add Task"
      />
    </>
  );
};
