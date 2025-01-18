import { builtinModules } from "node:module";
import { resolve } from "node:path";
import { defineConfig } from "vite";

import vitePluginDts from "vite-plugin-dts";

export default defineConfig({
    mode: "build",
    plugins: [vitePluginDts({ rollupTypes: true })],
    build: {
        minify: false,
        emptyOutDir: true,
        lib: {
            entry: {
                typenix: resolve(__dirname, "lib/index.ts"),
                "typenix-cli": resolve(__dirname, "lib/cli.ts"),
            },
            name: "TypeNix",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["fast-glob", "fsevents", "vite", ...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
        },
    },
});
