import type React from "react";

export const CompletedSection: React.FC = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
      <div className="bg-white rounded-lg p-6 text-center text-gray-400">
        No completed tasks yet.
      </div>
    </section>
  );
};
