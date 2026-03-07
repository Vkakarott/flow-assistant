import type { Disciplina } from "../core/types";
import disciplinasFallback from "../data/disciplinas.json";
import { getSupabaseServerClient } from "../lib/supabase/server";

interface CurriculumRow {
  id: number;
  nome: string;
  periodo_ideal: number;
  pre_requisitos: number[] | null;
  carga_horaria: number;
  creditos: number;
  tipo: "obrigatoria" | "optativa";
}

export async function getCurriculumItems(
  curriculumCode = "cc-2017"
): Promise<Disciplina[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("curriculum_items")
      .select(
        "id, nome, periodo_ideal, pre_requisitos, carga_horaria, creditos, tipo"
      )
      .eq("curriculum_code", curriculumCode)
      .order("periodo_ideal", { ascending: true })
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      return disciplinasFallback as Disciplina[];
    }

    return (data as CurriculumRow[]).map((item) => ({
      id: item.id,
      nome: item.nome,
      periodoIdeal: item.periodo_ideal,
      preRequisitos: item.pre_requisitos ?? [],
      cargaHoraria: item.carga_horaria,
      creditos: item.creditos,
      tipo: item.tipo
    }));
  } catch {
    return disciplinasFallback as Disciplina[];
  }
}
