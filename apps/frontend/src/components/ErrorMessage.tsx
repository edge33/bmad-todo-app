import type React from "react";

type ErrorMessageProps = {
  error: unknown;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const message =
    error instanceof Error ? error.message : "Failed to load tasks.";
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
    >
      {message}
    </div>
  );
};
