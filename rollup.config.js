"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified - code will be compiled but not uploaded");
} else if ((cfg = require("./screeps")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

export default {
  input: "src/main.ts",
  output: {
    file: "/Users/snatic/Library/Application Support/Screeps/scripts/10_244_184_133___21025/default/main.js",
    // file: "/Users/snatic/Library/Application Support/Screeps/scripts/192_168_178_26___21025/default/main.js",
    // file: "/Users/snatic/Library/Application Support/Screeps/scripts/screeps.com/default/main.js",
    format: "cjs",
    sourcemap: true
  },

  external: [ 'lodash' ],
  plugins: [
    clear({ targets: ["dist"] }),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    screeps({config: cfg, dryRun: cfg == null})
  ]
}
