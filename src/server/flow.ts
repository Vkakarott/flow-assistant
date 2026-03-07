import type { Disciplina } from "../core/types";
import disciplinasFallback from "../data/disciplinas.json";
import { prisma } from "../lib/prisma";

export async function getFlowItems(flowCode: string): Promise<Disciplina[]> {
  if (!process.env.DATABASE_URL) {
    return disciplinasFallback as Disciplina[];
  }

  try {
    const data = await prisma.flowItem.findMany({
      where: { flowCode },
      orderBy: [{ periodoIdeal: "asc" }, { id: "asc" }]
    });

    if (!data || data.length === 0) {
      return disciplinasFallback as Disciplina[];
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
    return disciplinasFallback as Disciplina[];
  }
}
