import type { Disciplina } from "./types";
import type { AcademicState } from "./state";

export type DisciplinaStatus =
    | "concluida"
    | "cursando"
    | "disponivel"
    | "bloqueada";

export function calcularStatus(
    disciplina: Disciplina,
    state: Pick<AcademicState, "concluidas" | "cursando">
): DisciplinaStatus {
    if (state.concluidas.includes(disciplina.id)) {
        return "concluida";
    }

    if (state.cursando.includes(disciplina.id)) {
        return "cursando";
    }

    const disponivel = disciplina.preRequisitos.every(pr =>
        state.concluidas.includes(pr)
    );

    return disponivel ? "disponivel" : "bloqueada";
}
