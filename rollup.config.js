// Copyright 2018 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// <https://apache.org/licenses/LICENSE-2.0>.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// rollup.config.js
// import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'Sk',
    // format: 'cjs',
    
    file: 'dist/bundle.js',
  },
  plugins: [typescript({sourceMap: false, inlineSources: true})],
};

// import babel from "rollup-plugin-babel";
// import pkg from "./package.json";
// import minify from "rollup-plugin-babel-minify";
// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";

// export default [
//     {
//         input: "main.js",
//         plugins: [
//             commonjs({
//                 include: /node_modules/,
//             }),
//             babel(),
//             resolve({ browser: true }),
//             minify({
//                 comments: false,
//             }),
//         ],
//         output: [
//             // Create a browser-friendly UMD build.
//             { name: "phyloTree", file: "dist/phyloTree-umd.js", format: "umd" },
//         ],
//     },
// ];
