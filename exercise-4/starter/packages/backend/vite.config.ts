import { defineConfig } from "vite";
import { resolve } from "path";
import { builtinModules } from "module";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "plugin-template-backend",
      fileName: (format) => "script.js",
      formats: ["es"],
    },
    outDir: "../../dist/backend",
    minify: false,
    rollupOptions: {
      external: [/caido:.+/, ...builtinModules],
      output: {
        manualChunks: undefined,
      },
    },
  },
});
