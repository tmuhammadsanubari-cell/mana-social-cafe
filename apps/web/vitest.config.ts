import { defineConfig } from "vitest/config";

const LIB_COVERAGE_MIN = 90; // PRD 13.8 dan 15: cakupan src/lib minimal 90%

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts"],
      thresholds: {
        lines: LIB_COVERAGE_MIN,
        functions: LIB_COVERAGE_MIN,
        branches: LIB_COVERAGE_MIN,
        statements: LIB_COVERAGE_MIN,
      },
    },
  },
});
