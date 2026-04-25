import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    strictPort: false, // ✅ FIX
    open: true,
  },

  preview: {
    port: 4173,
  },

  build: {
    outDir: "dist",
  },
});