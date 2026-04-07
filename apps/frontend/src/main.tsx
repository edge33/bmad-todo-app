import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { queryClient } from "./config/queryClient";
import { ToastProvider } from "./context/ToastContext.tsx";
import "./index.css";

// Initialize dark mode preference from localStorage
function initializeDarkMode() {
  try {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  } catch (error) {
    // Silently fail in restricted contexts (private browsing, workers, etc.)
    console.warn("Dark mode initialization failed:", error);
  }
}

initializeDarkMode();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element with id='root' not found in index.html. Check that <div id='root'></div> exists.",
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
