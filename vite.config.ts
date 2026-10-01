import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// GitHub Pages serves the project under /zaapi-take-home/ (ADR 0001). Dev, build and preview all
// use the same base, so a base-path bug shows up locally too.
export default defineConfig({
  base: "/zaapi-take-home/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["tests/unit/**/*.test.ts"] },
});
