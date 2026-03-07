import type { Disciplina } from "../core/types";
import disciplinasFallback from "../data/disciplinas.json";
import { DEFAULT_FLOW_CODE } from "../config/flow";
import { prisma } from "../lib/prisma";

function getFallbackFlowItems(flowCode: string): Disciplina[] {
  if (flowCode !== DEFAULT_FLOW_CODE) {
    return [];
  }

  return disciplinasFallback as Disciplina[];
}

export async function getFlowItems(flowCode: string): Promise<Disciplina[]> {
  if (!process.env.DATABASE_URL || !flowCode) {
    return getFallbackFlowItems(flowCode);
  }

  try {
    const data = await prisma.flowItem.findMany({
      where: { flowCode },
      orderBy: [{ periodoIdeal: "asc" }, { id: "asc" }]
    });

    if (!data || data.length === 0) {
      return getFallbackFlowItems(flowCode);
    }

    return data.map((item) => ({
      id: item.id,
      nome: item.nome,
      periodoIdeal: item.periodoIdeal,
      preRequisitos: item.preRequisitos ?? [],
      cargaHoraria: item.cargaHoraria,
      creditos: item.creditos,
      tipo: item.tipo as "obrigatoria" | "optativa"
    }));
  } catch {
    return getFallbackFlowItems(flowCode);
  }
}

export async function getSystemFlowCodes(): Promise<string[]> {
  if (!process.env.DATABASE_URL) {
    return [DEFAULT_FLOW_CODE];
  }

  try {
    const rows = await prisma.flowItem.findMany({
      select: { flowCode: true },
      distinct: ["flowCode"],
      orderBy: { flowCode: "asc" }
    });

    const codes = rows.map((row) => row.flowCode);
    if (!codes.includes(DEFAULT_FLOW_CODE)) {
      codes.push(DEFAULT_FLOW_CODE);
    }

    return codes.sort((a, b) => a.localeCompare(b));
  } catch {
    return [DEFAULT_FLOW_CODE];
  }
}

export async function getUserFlowCodes(userIdentifier: string): Promise<string[]> {
  if (!process.env.DATABASE_URL || !userIdentifier) {
    return [];
  }

  try {
    const rows = await prisma.userFlowProgress.findMany({
      where: { userIdentifier },
      select: { flowCode: true },
      distinct: ["flowCode"],
      orderBy: { flowCode: "asc" }
    });

    return rows.map((row) => row.flowCode);
  } catch {
    return [];
  }
}
