import "./App.css";
import { CompletedSection } from "./components/CompletedSection";
import { TaskInput } from "./components/TaskInput";
import { TasksSection } from "./components/TasksSection";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col md:flex-row md:gap-6 p-4 md:p-6">
      {/* Input field - full width, positioned at top on desktop, bottom on mobile */}
      <div className="order-3 md:order-1 w-full md:mb-6">
        <TaskInput />
      </div>

      {/* Tasks section - 60% on desktop, full width on mobile */}
      <div className="order-1 md:order-2 w-full md:w-3/5">
        <TasksSection />
      </div>

      {/* Completed section - 40% on desktop, full width on mobile */}
      <div className="order-2 md:order-3 w-full md:w-2/5">
        <CompletedSection />
      </div>
    </div>
  );
}

export default App;
