import { PluginOption, UserConfig, defineConfig as viteDefineConfig } from "vite";
import { basename } from "node:path";
import { globSync } from "glob";

type TypeNixConfig = {
    // The path containing the .flake.ts files relative to the root of the project
    flakesPath: string;
};

export const defineConfig = (config: UserConfig & { typenix?: TypeNixConfig }): UserConfig => {
    const typenixConfig = config.typenix ?? { flakesPath: "flakes" };
    delete config.typenix;

    const flakes: string[] = globSync(`${typenixConfig.flakesPath}/**/*.flake.ts`);

    if (!Array.isArray(config.plugins)) {
        config.plugins = [TypeNix()];
    } else {
        config.plugins.unshift(TypeNix());
    }

    config.build = {
        minify: false,
        lib: {
            entry: flakes.reduce((acc, file) => {
                const name = basename(file).replace(".ts", "");
                return { ...acc, [name]: file };
            }, {}),
            name: "Flakes",
            formats: ["es"],
        },
        rollupOptions: {
            external(source, _importer, isResolved) {
                if (isResolved) return false;
                return source.startsWith("node:") || source.startsWith("github:");
            },
        },
    };

    return viteDefineConfig(config);
};

export default function TypeNix(): PluginOption {
    return [
        {
            name: "vite-plugin-typenix",
            apply: "build",
            enforce: "pre",
        },
    ];
}
