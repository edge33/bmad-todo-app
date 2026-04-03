import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return <div>TodoApp</div>;
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element with id='root' not found in index.html. Check that <div id='root'></div> exists in apps/frontend/index.html",
  );
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
