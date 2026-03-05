import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const THEME_KEY = "portfolio-theme";

const initTheme = () => {
  const root = document.documentElement;
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  const theme = savedTheme === "light" ? "light" : "dark";

  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

const hideInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (!loader) return;

  loader.classList.add("is-hidden");
  window.setTimeout(() => loader.remove(), 260);
};

initTheme();

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(() => {
  requestAnimationFrame(hideInitialLoader);
});

window.addEventListener("load", hideInitialLoader, { once: true });
