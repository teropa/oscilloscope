import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: {
      name: "index",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [resolve(), commonjs(), typescript()],
  },
  {
    input: "src/index.ts",
    plugins: [typescript()],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
  },
];
