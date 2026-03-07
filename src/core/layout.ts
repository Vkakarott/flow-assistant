import type { Disciplina } from "./types";

export function groupByPeriodo(disciplinas: Disciplina[]) {
    const map = new Map<number, Disciplina[]>();

    disciplinas.forEach(d => {
        if (!map.has(d.periodoIdeal)) {
            map.set(d.periodoIdeal, []);
        }
        map.get(d.periodoIdeal)!.push(d);
    });

    return map;
}
