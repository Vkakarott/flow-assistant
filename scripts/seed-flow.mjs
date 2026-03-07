import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

const flowCode = argValue("--code", "cc-2017");
const filePath = argValue("--file", "src/data/disciplinas.json");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const raw = await readFile(filePath, "utf8");
const items = JSON.parse(raw);

if (!Array.isArray(items) || items.length === 0) {
  console.error(`No items found in ${filePath}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const rows = items.map((item) => ({
  flow_code: flowCode,
  id: item.id,
  nome: item.nome,
  periodo_ideal: item.periodoIdeal,
  pre_requisitos: item.preRequisitos,
  carga_horaria: item.cargaHoraria,
  creditos: item.creditos,
  tipo: item.tipo
}));

const { error } = await supabase
  .from("flow_items")
  .upsert(rows, { onConflict: "flow_code,id" });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(
  `Seed completed: ${rows.length} rows upserted for flow ${flowCode} from ${filePath}.`
);
