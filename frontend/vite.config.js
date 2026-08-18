import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite configuration
 * --------------------------------------------------
 * UI-only scaffold for the Finance Advisor product.
 * Update `base` to match your repo name if deploying
 * to GitHub Pages, e.g. base: "/finance-advisor/"
 */
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
