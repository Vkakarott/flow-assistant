import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import "./lib/load-env.mjs";

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

const flowCode = argValue("--code", "cc-2017");
const filePath = argValue("--file", "src/data/disciplinas.json");

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "Missing DIRECT_URL or DATABASE_URL. Prisma seed requires a PostgreSQL connection string."
  );
  process.exit(1);
}

const raw = await readFile(filePath, "utf8");
const items = JSON.parse(raw);

if (!Array.isArray(items) || items.length === 0) {
  console.error(`No items found in ${filePath}`);
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

const rows = items.map((item) => ({
  flowCode,
  id: item.id,
  nome: item.nome,
  periodoIdeal: item.periodoIdeal,
  preRequisitos: item.preRequisitos,
  cargaHoraria: item.cargaHoraria,
  creditos: item.creditos,
  tipo: item.tipo
}));

try {
  for (const row of rows) {
    await prisma.flowItem.upsert({
      where: {
        flowCode_id: {
          flowCode: row.flowCode,
          id: row.id
        }
      },
      update: {
        nome: row.nome,
        periodoIdeal: row.periodoIdeal,
        preRequisitos: row.preRequisitos,
        cargaHoraria: row.cargaHoraria,
        creditos: row.creditos,
        tipo: row.tipo
      },
      create: row
    });
  }
} catch (error) {
  console.error("Seed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}

console.log(
  `Seed completed: ${rows.length} rows upserted for flow ${flowCode} from ${filePath}.`
);
