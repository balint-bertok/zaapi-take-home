import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { resetDemo } from "./store/store";
import "./index.css";

// `?reset=1` puts the demo back to its fixtures (documented in docs/architecture.md).
if (new URLSearchParams(location.search).get("reset") === "1") resetDemo();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
