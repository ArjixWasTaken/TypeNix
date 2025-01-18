import { hello } from "github:nixos/nixpkgs";

export const packages = {
    "x86_64-linux": { default: hello },
};
