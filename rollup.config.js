/**
 * 时间 2021-07-12 20:05:01
 * 作者 chenhu.pei
 */
// import builtins from "rollup-plugin-node-builtins";
// import globals from "rollup-plugin-node-globals";
// import nodePolyfills from "rollup-plugin-node-polyfills";
// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript";
import pkg from "./package.json";
// 依赖包
// const pkg_inside = ["fs", "path", "http", "https"];
const pkg_external = ["source-map"];
// 规范包
const bundle = {
    umd: {
        // 全平台规范包
        format: "umd",
        file: pkg.umd,
        name: "debugSourceMap"
    },
    iife: {
        // 浏览器平台规范包
        format: "iife",
        file: pkg.iife,
        name: "debugSourceMap"
    },
    cjs: {
        // Node 平台规范包
        format: "cjs",
        file: pkg.cjs,
        banner: "#!/usr/bin/env node",
        external: pkg_external
    },
    esm: {
        // NodeESM 平台规范包
        format: "es",
        file: pkg.esm
    }
};
// 导出构建配置
export default [
    // {
    //     input: "src/main.js",
    //     plugins: [
    //         builtins(),
    //         globals(),
    //         resolve(), // 用于支持查找 "source-map" 依赖包
    //         commonjs(), // 用于 "source-map" 依赖包转换成 ESM
    //         nodePolyfills()
    //     ],
    //     output: [
    //         // 输出规范包
    //         bundle.iife,
    //         bundle.umd
    //     ]
    // },
    {
        input: "src/main.ts",
        external: pkg_external,
        plugins: [typescript(), terser()],
        output: [
            // 输出规范包
            bundle.cjs,
            bundle.esm
        ]
    }
];
