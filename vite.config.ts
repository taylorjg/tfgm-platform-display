import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: "/tfgm-platform-display",
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: false,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
