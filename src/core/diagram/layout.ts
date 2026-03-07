import type { Disciplina } from "../types";

export const CARD_WIDTH = 160;
export const CARD_HEIGHT = 64;
export const GAP_X = 28;
export const GAP_Y = 34;
export const OFFSET_X = 140;
export const OFFSET_Y = 20;

export interface PositionedDisciplina extends Disciplina {
    col: number;
    row: number;
    x: number;
    y: number;
}

export function buildLayout(
    disciplinas: Disciplina[]
): PositionedDisciplina[] {
    const grouped = new Map<number, Disciplina[]>();

    disciplinas.forEach(d => {
        if (!grouped.has(d.periodoIdeal)) {
            grouped.set(d.periodoIdeal, []);
        }
        grouped.get(d.periodoIdeal)!.push(d);
    });

    const result: PositionedDisciplina[] = [];

    grouped.forEach((list, periodo) => {
        list.forEach((disciplina, index) => {
            const x = OFFSET_X + index * (CARD_WIDTH + GAP_X);
            const y = OFFSET_Y + (periodo - 1) * (CARD_HEIGHT + GAP_Y);

            result.push({
                ...disciplina,
                col: index,
                row: periodo - 1,
                x,
                y
            });
        });
    });

    return result;
}

export function getDiagramSize(nodes: PositionedDisciplina[]) {
    if (nodes.length === 0) {
        return { width: 0, height: 0 };
    }

    const maxX = Math.max(...nodes.map(node => node.x + CARD_WIDTH));
    const maxY = Math.max(...nodes.map(node => node.y + CARD_HEIGHT));

    return {
        width: maxX + OFFSET_X,
        height: maxY + 20
    };
}
