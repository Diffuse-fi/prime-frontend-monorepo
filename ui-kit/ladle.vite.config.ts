import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tsconfigPaths(), tailwind()],
});
