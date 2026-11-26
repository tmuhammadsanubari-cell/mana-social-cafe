// Aturan PRD 13.8. Batas angka di sini adalah batas standar kode, bukan nilai tampilan.
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import boundaries from "eslint-plugin-boundaries";
import globals from "globals";
import tseslint from "typescript-eslint";

const quality = {
  "@typescript-eslint/no-explicit-any": "error",
  "no-empty": ["error", { allowEmptyCatch: false }],
  "no-console": "error",
  complexity: ["error", 10],
  "max-lines-per-function": ["error", { max: 40, skipBlankLines: true, skipComments: true }],
  "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
  "@typescript-eslint/naming-convention": [
    "error",
    { selector: "function", format: ["camelCase", "PascalCase"] },
    { selector: "typeLike", format: ["PascalCase"] },
  ],
};

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/.astro/**", "**/.sanity/**", "**/node_modules/**", "**/coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: quality,
  },
  {
    files: ["apps/web/src/**/*.{ts,astro}"],
    rules: {
      "no-magic-numbers": ["error", { ignore: [0, 1], ignoreArrayIndexes: true, ignoreDefaultValues: true }],
    },
  },
  {
    files: ["apps/web/src/components/**/*.astro"],
    rules: { "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }] },
  },
  {
    // Lapisan apps/web (apps/web/CLAUDE.md): lib murni, tidak mengimpor components, layouts, atau pages.
    files: ["apps/web/src/**/*.{ts,astro}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "pages", pattern: "apps/web/src/pages/**" },
        { type: "layouts", pattern: "apps/web/src/layouts/**" },
        { type: "components", pattern: "apps/web/src/components/**" },
        { type: "lib", pattern: "apps/web/src/lib/**" },
        { type: "assets", pattern: "apps/web/src/{assets,styles}/**" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "pages" } },
              allow: { to: { element: { types: ["components", "layouts", "lib", "assets"] } } },
            },
            {
              from: { element: { type: "layouts" } },
              allow: { to: { element: { types: ["components", "lib", "assets"] } } },
            },
            {
              from: { element: { type: "components" } },
              allow: { to: { element: { types: ["components", "lib", "assets"] } } },
            },
            { from: { element: { type: "lib" } }, allow: { to: { element: { type: "lib" } } } },
          ],
        },
      ],
    },
  },
  {
    files: ["**/tests/**/*.ts"],
    rules: { "max-lines-per-function": "off" },
  },
);
