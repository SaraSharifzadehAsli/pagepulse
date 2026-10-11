/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the build also works when GitHub Pages serves it
  // from /pagepulse/ rather than the root of a domain.
  base: "./",
  resolve: {
    // React strips the Profiler API out of its production build, so in a
    // normal `vite build` <Profiler onRender> is never called and the render
    // timings this app is built around never arrive. The profiling build is
    // the production build with that instrumentation kept in. Exact match
    // only: react-dom/client requires "react-dom" internally, and that is
    // the import this needs to redirect.
    alias: [{ find: /^react-dom$/, replacement: "react-dom/profiling" }],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
  },
});
