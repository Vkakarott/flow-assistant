export interface Disciplina {
    id: number;
    nome: string;
    periodoIdeal: number;
    preRequisitos: number[];
    cargaHoraria: number;
    creditos: number;
    tipo: "obrigatoria" | "optativa";
}
