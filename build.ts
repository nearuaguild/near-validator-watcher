import { build } from "bun";
import { resolve } from "path";

const outfilePath = resolve(__dirname, "watcher");

try {
  await Bun.file(outfilePath).delete();
  console.log("Removed previous binary, if existed");
} catch (error) {
  if ((error as any).code === "ENOENT") {
    console.log("No previous binary existed, moving on");
  } else {
    console.error("Failed to remove previous binary:", error);
  }
}

await build({
  entrypoints: ["src/index.ts"],
  compile: {
    outfile: outfilePath,
  },
  minify: true,
});
console.log("Compilation finished!");
console.log(`The executable is available at '${outfilePath}'`);
