// eslint.config.mjs
import { defineConfig } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
 {
  files: ["**/*.ts", "**/*.tsx"],
  plugins: {
   "@typescript-eslint": typescriptEslint,
   "@next/next": nextPlugin,
  },
  languageOptions: {
   parser: tsParser,
   parserOptions: {
    project: "./tsconfig.json",
   },
  },
  rules: {
   // Next.js rules
   "@next/next/no-html-link-for-pages": "error",
   "@next/next/no-img-element": "error",

   // TypeScript rules
   "@typescript-eslint/no-explicit-any": "warn",
   "@typescript-eslint/explicit-function-return-type": "off",
   "@typescript-eslint/no-unused-vars": [
    "error",
    {
     argsIgnorePattern: "^_",
     varsIgnorePattern: "^_",
    },
   ],
  },
 },
 {
  ignores: [
   ".next/**",
   "out/**",
   "build/**",
   "next-env.d.ts",
   "node_modules/**",
   "dist/**",
  ],
 },
]);
