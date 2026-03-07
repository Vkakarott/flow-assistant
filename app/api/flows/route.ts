import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/auth/options";
import { getSystemFlowCodes, getUserFlowCodes } from "../../../src/server/flow";
import { prisma } from "../../../src/lib/prisma";
import type { Disciplina } from "../../../src/core/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userIdentifier = session?.user?.email ?? session?.user?.name ?? "";

  const [systemFlowCodes, userFlowCodes] = await Promise.all([
    getSystemFlowCodes(),
    getUserFlowCodes(userIdentifier)
  ]);

  return NextResponse.json({
    systemFlowCodes,
    userFlowCodes
  });
}

function isValidDisciplina(item: unknown): item is Disciplina {
  if (!item || typeof item !== "object") return false;
  const value = item as Record<string, unknown>;

  return (
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    typeof value.nome === "string" &&
    value.nome.trim().length > 0 &&
    typeof value.periodoIdeal === "number" &&
    Number.isInteger(value.periodoIdeal) &&
    Array.isArray(value.preRequisitos) &&
    value.preRequisitos.every((pr) => typeof pr === "number" && Number.isInteger(pr)) &&
    typeof value.cargaHoraria === "number" &&
    Number.isInteger(value.cargaHoraria) &&
    typeof value.creditos === "number" &&
    Number.isInteger(value.creditos) &&
    (value.tipo === "obrigatoria" || value.tipo === "optativa")
  );
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL not configured" },
      { status: 503 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let payload: { flowCode?: string; disciplinas?: unknown } | null = null;
  try {
    payload = (await request.json()) as { flowCode?: string; disciplinas?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const flowCode = (payload?.flowCode ?? "").trim();
  const disciplinasRaw = payload?.disciplinas;

  if (!flowCode) {
    return NextResponse.json({ ok: false, error: "flowCode is required" }, { status: 400 });
  }

  if (!Array.isArray(disciplinasRaw) || disciplinasRaw.length === 0) {
    return NextResponse.json(
      { ok: false, error: "disciplinas must be a non-empty array" },
      { status: 400 }
    );
  }

  if (!disciplinasRaw.every(isValidDisciplina)) {
    return NextResponse.json(
      { ok: false, error: "Invalid disciplinas format" },
      { status: 400 }
    );
  }

  const disciplinas = disciplinasRaw as Disciplina[];
  const uniqueIds = new Set(disciplinas.map((item) => item.id));
  if (uniqueIds.size !== disciplinas.length) {
    return NextResponse.json(
      { ok: false, error: "Duplicated disciplina id in payload" },
      { status: 400 }
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.flowItem.deleteMany({ where: { flowCode } });
      await tx.flowItem.createMany({
        data: disciplinas.map((item) => ({
          flowCode,
          id: item.id,
          nome: item.nome,
          periodoIdeal: item.periodoIdeal,
          preRequisitos: item.preRequisitos,
          cargaHoraria: item.cargaHoraria,
          creditos: item.creditos,
          tipo: item.tipo
        }))
      });
    });

    return NextResponse.json({
      ok: true,
      flowCode,
      inserted: disciplinas.length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
