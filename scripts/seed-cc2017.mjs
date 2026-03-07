import { createClient } from "@supabase/supabase-js";
import disciplinas from "../src/data/disciplinas.json" with { type: "json" };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const rows = disciplinas.map((item) => ({
  curriculum_code: "cc-2017",
  id: item.id,
  nome: item.nome,
  periodo_ideal: item.periodoIdeal,
  pre_requisitos: item.preRequisitos,
  carga_horaria: item.cargaHoraria,
  creditos: item.creditos,
  tipo: item.tipo
}));

const { error } = await supabase
  .from("curriculum_items")
  .upsert(rows, { onConflict: "curriculum_code,id" });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seed completed: ${rows.length} rows upserted for curriculum cc-2017.`);
