import type { PositionedDisciplina } from "./layout";

export interface Connection {
    from: PositionedDisciplina;
    to: PositionedDisciplina;
    laneShiftX: number;
    laneShiftY: number;
}

function centeredShifts(count: number, step: number): number[] {
    if (count <= 1) return [0];
    const middle = (count - 1) / 2;
    return Array.from({ length: count }, (_, index) =>
        Math.round((index - middle) * step)
    );
}

export function buildConnections(
    nodes: PositionedDisciplina[]
): Connection[] {
    const map = new Map<number, PositionedDisciplina>();
    nodes.forEach(n => map.set(n.id, n));

    const connections: Connection[] = [];

    nodes.forEach(node => {
        const deps = node.preRequisitos
            .map((pr) => map.get(pr))
            .filter((value): value is PositionedDisciplina => Boolean(value))
            .sort((a, b) => (a.col - b.col) || (a.row - b.row) || (a.id - b.id));

        const left = deps.filter((from) => from.col < node.col);
        const right = deps.filter((from) => from.col > node.col);
        const vertical = deps.filter((from) => from.col === node.col);
        const leftShifts = centeredShifts(left.length, 6);
        const rightShifts = centeredShifts(right.length, 6);
        const verticalShifts = centeredShifts(vertical.length, 4);

        left.forEach((from, index) => {
            connections.push({
                from,
                to: node,
                laneShiftX: leftShifts[index],
                laneShiftY: leftShifts[index]
            });
        });

        right.forEach((from, index) => {
            connections.push({
                from,
                to: node,
                laneShiftX: rightShifts[index],
                laneShiftY: rightShifts[index]
            });
        });

        vertical.forEach((from, index) => {
            connections.push({
                from,
                to: node,
                laneShiftX: 0,
                laneShiftY: verticalShifts[index]
            });
        });
    });

    return connections;
}
