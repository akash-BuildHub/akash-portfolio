import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const initTheme = () => {
  // Dark mode only — light/white theme has been removed.
  const root = document.documentElement;
  root.classList.remove("light");
  root.classList.add("dark");
};

initTheme();

createRoot(document.getElementById("root")!).render(<App />);
