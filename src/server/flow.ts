import type { Disciplina } from "../core/types";
import { prisma } from "../lib/prisma";

export async function getFlowItems(flowCode: string): Promise<Disciplina[]> {
  if (!process.env.DATABASE_URL || !flowCode) {
    return [];
  }

  try {
    const data = await prisma.flowItem.findMany({
      where: { flowCode },
      orderBy: [{ periodoIdeal: "asc" }, { id: "asc" }]
    });

    if (!data || data.length === 0) {
      return [];
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
    return [];
  }
}

export async function getSystemFlowCodes(): Promise<string[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const rows = await prisma.flowItem.findMany({
      select: { flowCode: true },
      distinct: ["flowCode"],
      orderBy: { flowCode: "asc" }
    });

    return rows.map((row) => row.flowCode);
  } catch {
    return [];
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
