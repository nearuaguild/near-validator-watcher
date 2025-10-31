import { build } from "bun";
import { resolve } from "path";

const outfilePath = resolve(__dirname, "watcher");

await Bun.file(outfilePath).delete();
console.log("Removed previous binary, if existed");

await build({
  entrypoints: ["src/index.ts"],
  compile: {
    outfile: outfilePath,
  },
  minify: true,
});
console.log("Compilation finished!");
console.log(`The executable is available at '${outfilePath}'`);
