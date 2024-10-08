import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "plugin-template",
      fileName: (format) => "script.js",
      formats: ["es"],
    },
    outDir: "dist",
    minify: false,
    rollupOptions: {
      external: [/caido:.+/],
      output: {
        manualChunks: undefined,
      },
      plugins: [
        {
          name: "Render Workflow",
          generateBundle: async function generateBundle(options, bundle) {
            const script = bundle["script.js"];
            if (script && script.type === "chunk") {
              const templatePath = resolve(__dirname, "workflow.template.json");
              const template = await fs.promises.readFile(
                templatePath,
                "utf-8",
              );
              const workflow = template.replace(
                '"[REPLACE_SCRIPT]"',
                JSON.stringify(script.code),
              );
              this.emitFile({
                fileName: "workflow.json",
                source: workflow,
                type: "asset",
              });
            }
          },
        },
      ],
    },
  },
});
