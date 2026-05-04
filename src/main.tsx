import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // ← THIS LINE WAS MISSING!

// 🔥 Prevent Promise crash from breaking UI
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Promise:", event.reason);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
