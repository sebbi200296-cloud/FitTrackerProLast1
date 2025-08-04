import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Only include cartographer plugin in non-production and when REPL_ID is defined
const plugins = [
  react(),
  runtimeErrorOverlay(),
];

// Synchronously require cartographer if possible
if (
  process.env.NODE_ENV !== "production" &&
  process.env.REPL_ID !== undefined
) {
  // Use require instead of dynamic import for deployment compatibility
  try {
    const { cartographer } = require("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  } catch (err) {
    // Plugin not available, skip
  }
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
});
