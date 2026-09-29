import { createRoot } from "react-dom/client";
import App from "@/app/App";
import "@/styles/index.css";

// Dark mode only: index.html adds the `dark` class before this bundle loads.
createRoot(document.getElementById("root")!).render(<App />);
