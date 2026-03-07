import type { Disciplina } from "./types";

export type DependencyMap = Map<number, number[]>;

/**
 * Para cada disciplina A,
 * lista quais disciplinas dependem de A
 */
export function buildDependencyMap(
    disciplinas: Disciplina[]
): DependencyMap {
    const map: DependencyMap = new Map();

    // inicializa
    disciplinas.forEach(d => {
        map.set(d.id, []);
    });

    // popula dependências
    disciplinas.forEach(d => {
        d.preRequisitos.forEach(pr => {
            map.get(pr)?.push(d.id);
        });
    });

    return map;
}
