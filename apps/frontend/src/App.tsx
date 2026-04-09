import "./App.css";
import { useEffect, useState } from "react";
import { CompletedSection } from "./components/CompletedSection";
import { TaskInput } from "./components/TaskInput";
import { TasksSection } from "./components/TasksSection";
import { useDarkMode } from "./hooks/useDarkMode";

function TaskLayout() {
  const [completionEntranceId, setCompletionEntranceId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (completionEntranceId === null) {
      return;
    }
    const timer = window.setTimeout(() => setCompletionEntranceId(null), 850);
    return () => window.clearTimeout(timer);
  }, [completionEntranceId]);

  return (
    <div className="order-1 flex min-w-0 flex-1 flex-col gap-8 transition-all duration-200 ease-out md:order-2 md:flex-row md:items-start md:gap-6">
      <div className="min-w-0 w-full md:w-1/2">
        <TasksSection onCompleteStart={setCompletionEntranceId} />
      </div>
      <div className="min-w-0 w-full md:w-1/2">
        <CompletedSection entranceTaskId={completionEntranceId} />
      </div>
    </div>
  );
}

function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-slate-700/80 dark:hover:bg-slate-600"
    >
      {isDark ? (
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-slate-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
          />
        </svg>
      )}
    </button>
  );
}

function App() {
  return (
    <div
      data-testid="app-container"
      className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#f5f3ff] to-[#e8f5e9] dark:from-slate-900 dark:to-slate-800"
    >
      <DarkModeToggle />
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col p-4 transition-all duration-200 ease-out md:p-6">
        {/* Input field - full width, always at top */}
        <div className="order-1 mb-6 w-full shrink-0">
          <TaskInput />
        </div>
        <TaskLayout />
      </div>
    </div>
  );
}

export default App;
