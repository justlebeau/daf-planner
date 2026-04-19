import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Change BASE to your GitHub repo name, e.g. "/daf-planner"
// If using a custom domain or user/org page, set to "/"
const BASE = "/daf-planner";

export default defineConfig({
  plugins: [react()],
  base: BASE,
});
