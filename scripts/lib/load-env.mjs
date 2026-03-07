import { existsSync } from "node:fs";
import { config } from "dotenv";

const candidates = [".env.local", ".env", ".env.example"];

for (const path of candidates) {
  if (existsSync(path)) {
    config({ path, override: false });
  }
}
