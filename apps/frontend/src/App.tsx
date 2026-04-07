import "./App.css";
import { useEffect, useState } from "react";
import { CompletedSection } from "./components/CompletedSection";
import { TaskInput } from "./components/TaskInput";
import { TasksSection } from "./components/TasksSection";

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
      <div className="min-w-0 w-full md:w-3/5">
        <TasksSection onCompleteStart={setCompletionEntranceId} />
      </div>
      <div className="min-w-0 w-full md:w-2/5">
        <CompletedSection entranceTaskId={completionEntranceId} />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col p-4 transition-all duration-200 ease-out md:p-6">
        {/* Input field - full width, positioned at top on desktop, bottom on mobile */}
        <div className="order-3 w-full shrink-0 md:order-1">
          <TaskInput />
        </div>
        <TaskLayout />
      </div>
    </div>
  );
}

export default App;
