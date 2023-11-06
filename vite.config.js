import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: false,
  },
  assetsInclude: ['"**/*.bpmn"'],
  base: "/trying-thesis-libraries/",
});