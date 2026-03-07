export interface Ingresso {
    ano: number;
    semestre: 1 | 2;
}

export function calcularPeriodoAtual(
    ingresso: Ingresso,
    referencia: Date = new Date()
): number {
    const anoAtual = referencia.getFullYear();

    // Janeiro–Junho = 1º semestre, Julho–Dezembro = 2º
    const semestreAtual: 1 | 2 =
        referencia.getMonth() < 6 ? 1 : 2;

    return (
        (anoAtual - ingresso.ano) * 2 +
        (semestreAtual - ingresso.semestre) +
        1
    );
}
