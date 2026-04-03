import type React from "react";
import { useState } from "react";

export const TaskInput: React.FC = () => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        console.log("Task to create:", value.trim());
        setValue("");
      }
    }
  };

  const handleEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setValue("");
    }
  };

  return (
    <input
      type="text"
      placeholder="Add a task..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        handleSubmit(e);
        handleEscape(e);
      }}
      className="w-full px-4 py-3 text-base border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
      aria-label="Add task description"
    />
  );
};
