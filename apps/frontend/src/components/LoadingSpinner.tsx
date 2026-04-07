import type React from "react";

export const LoadingSpinner: React.FC = () => (
  <div
    className="flex justify-center py-8"
    role="status"
    aria-live="polite"
    aria-label="Loading tasks"
  >
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
  </div>
);
