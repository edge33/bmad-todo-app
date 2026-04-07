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

  console.log("render app");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col md:flex-row md:gap-6 p-4 md:p-6">
      {/* Input field - full width, positioned at top on desktop, bottom on mobile */}
      <div className="order-3 md:order-1 w-full md:mb-6">
        <TaskInput />
      </div>
      <TaskLayout />
    </div>
  );
}

export default App;
