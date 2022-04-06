import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import WindiCss from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WindiCss()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
