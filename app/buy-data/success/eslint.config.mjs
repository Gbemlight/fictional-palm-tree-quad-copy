import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

// mimic CommonJS __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Optionally, specify other base directories for plugins and configs
  // resolvePluginsRelativeTo: __dirname,
});

// Use the FlatCompat utility to extend from existing configs
const eslintConfig = [...compat.extends("eslint-config-next/core-web-vitals.js", "eslint-config-next/typescript.js")];

export default eslintConfig;