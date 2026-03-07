import  type { PositionedDisciplina } from "./layout";

export interface Connection {
    from: PositionedDisciplina;
    to: PositionedDisciplina;
}

export function buildConnections(
    nodes: PositionedDisciplina[]
): Connection[] {
    const map = new Map<number, PositionedDisciplina>();
    nodes.forEach(n => map.set(n.id, n));

    const connections: Connection[] = [];

    nodes.forEach(node => {
        node.preRequisitos.forEach(pr => {
            const from = map.get(pr);
            if (from) {
                connections.push({ from, to: node });
            }
        });
    });

    return connections;
}
