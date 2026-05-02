import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🔥 GLOBAL ERROR HANDLER (prevents crash)
window.addEventListener("unhandledrejection", (event) => {
  console.error("UNHANDLED PROMISE:", event.reason);
});

// 🔥 SAFE RENDER
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
