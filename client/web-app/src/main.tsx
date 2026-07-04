import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Imports the actual font weights and styles into your bundle
import "@fontsource/geist-sans/index.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/700.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
