import pkg from "@app/../package.json" with { type: "json" };

export const APP_VERSION = pkg.version;
