import { existsSync } from "node:fs";
import { config } from "dotenv";

const candidates = [".env.local", ".env", ".env.example"];

for (const path of candidates) {
  if (existsSync(path)) {
    config({ path, override: false });
  }
}

if (!process.env.DATABASE_URL && process.env.SUPABASE_DB_URL) {
  process.env.DATABASE_URL = process.env.SUPABASE_DB_URL;
}

if (!process.env.DIRECT_URL && process.env.SUPABASE_DIRECT_URL) {
  process.env.DIRECT_URL = process.env.SUPABASE_DIRECT_URL;
}
