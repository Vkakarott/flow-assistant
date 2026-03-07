import { readFile } from "node:fs/promises";
import { Client } from "pg";

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error("Missing SUPABASE_DB_URL.");
  console.error(
    "Run the SQL from supabase/schema.sql manually in Supabase SQL Editor or set SUPABASE_DB_URL to automate."
  );
  process.exit(1);
}

const sql = await readFile("supabase/schema.sql", "utf8");
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("DB init completed: flow_items and user_flow_progress are ready.");
} catch (error) {
  console.error("DB init failed:", error.message);
  process.exit(1);
} finally {
  await client.end();
}
