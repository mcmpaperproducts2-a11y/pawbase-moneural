/** @type {import('vitest/config').UserConfig} */
export default {
  test: {
    globals: true,
    environment: "node",
    include: ["tests/unit/**/*.test.ts"]
  }
};
