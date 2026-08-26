import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container '#root' missing from index.html");

// Deliberately not wrapped in <StrictMode>: StrictMode double-invokes the
// mount phase in development, which would skew the render-time samples this
// app measures via React's Profiler API for the performance score.
createRoot(container).render(<App />);
