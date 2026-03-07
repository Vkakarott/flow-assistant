import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import "./lib/load-env.mjs";

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL. Set it in .env.local or .env.");
  process.exit(1);
}

const npxCmd = existsSync("node_modules/.bin/prisma")
  ? "node_modules/.bin/prisma"
  : "npx";
const args =
  npxCmd === "npx" ? ["prisma", "db", "push"] : ["db", "push"];

const result = spawnSync(npxCmd, args, {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env
});

process.exit(result.status ?? 1);
