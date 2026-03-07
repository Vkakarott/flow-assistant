import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import "./lib/load-env.mjs";

const migrateUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!migrateUrl) {
  console.error("Missing DIRECT_URL or DATABASE_URL. Set one in .env.local or .env.");
  process.exit(1);
}

if (!migrateUrl.startsWith("postgresql://")) {
  console.error(
    "Invalid DIRECT_URL/DATABASE_URL. Expected a postgresql:// connection string."
  );
  process.exit(1);
}

if (migrateUrl.includes("#")) {
  console.error(
    "Connection URL appears to contain '#'. URL-encode special chars in password (e.g. '#' => '%23') or wrap value in quotes."
  );
  process.exit(1);
}

const npxCmd = existsSync("node_modules/.bin/prisma")
  ? "node_modules/.bin/prisma"
  : "npx";
const args =
  npxCmd === "npx"
    ? ["prisma", "migrate", "deploy"]
    : ["migrate", "deploy"];

const result = spawnSync(npxCmd, args, {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    DATABASE_URL: migrateUrl
  }
});

process.exit(result.status ?? 1);
