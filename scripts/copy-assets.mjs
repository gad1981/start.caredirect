import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "assets");
const to = join(root, "public", "assets");

if (!existsSync(from)) {
  console.error("Missing ./assets");
  process.exit(1);
}

mkdirSync(join(root, "public"), { recursive: true });
rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
console.log("Copied assets → public/assets");
