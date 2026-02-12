import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const hideInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (!loader) return;

  loader.classList.add("is-hidden");
  window.setTimeout(() => loader.remove(), 260);
};

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(() => {
  requestAnimationFrame(hideInitialLoader);
});

window.addEventListener("load", hideInitialLoader, { once: true });
