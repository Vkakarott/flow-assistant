import { useEffect, useState } from "react";
import {
    buildLayout,
    CARD_HEIGHT,
    GAP_Y,
    OFFSET_X,
    OFFSET_Y,
    getDiagramSize
} from "../../core/diagram/layout";
import { buildConnections } from "../../core/diagram/connections";
import { calcularStatus } from "../../core/status";
import { DisciplineCard } from "./DisciplineCard";
import { PrerequisiteLine } from "../../components/diagram/PrerequisiteLine";

import type { AcademicAction, AcademicState } from "../../core/state";
import type { DisciplinaStatus } from "../../core/status";
import type { Disciplina } from "../../core/types";

interface CourseDiagramProps {
    state: AcademicState;
    dispatch: React.Dispatch<AcademicAction>;
    disciplinas: Disciplina[];
}

function nextActionByStatus(status: DisciplinaStatus, id: number): AcademicAction | null {
    if (status === "bloqueada") {
        return null;
    }

    if (status === "disponivel") {
        return { type: "MARK_CURSANDO", id };
    }

    if (status === "cursando") {
        return { type: "MARK_CONCLUIDA", id };
    }

    return { type: "MARK_PENDENTE", id };
}

export function CourseDiagram({
    state,
    dispatch,
    disciplinas
}: CourseDiagramProps) {
    const [mobileScale, setMobileScale] = useState(1);
    const nodes = buildLayout(disciplinas);
    const connections = buildConnections(nodes);
    const { width, height } = getDiagramSize(nodes);
    const canvasWidth = Math.max(width, 800);
    const canvasHeight = Math.max(height, 600);
    const maxPeriodo = nodes.length
        ? Math.max(...nodes.map(node => node.periodoIdeal))
        : 0;

    useEffect(() => {
        const onResize = () => {
            setMobileScale(window.innerWidth < 768 ? 0.72 : 1);
        };

        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <div className="h-full w-full overflow-auto bg-[#09090b]">
            <div
                style={{
                    width: `${canvasWidth * mobileScale}px`,
                    height: `${canvasHeight * mobileScale}px`
                }}
            >
            <svg
                width={canvasWidth}
                height={canvasHeight}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                style={{
                    transform: `scale(${mobileScale})`,
                    transformOrigin: "top left"
                }}
            >
                <defs>
                    <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0a0a0b" />
                        <stop offset="100%" stopColor="#111113" />
                    </linearGradient>
                    <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="9"
                        refY="5"
                        markerUnits="strokeWidth"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
                    </marker>
                </defs>

                <rect width="100%" height="100%" fill="url(#bgGradient)" />

                {Array.from({ length: maxPeriodo }, (_, index) => {
                    const y = OFFSET_Y + index * (CARD_HEIGHT + GAP_Y) - 12;
                    const rowHeight = CARD_HEIGHT + GAP_Y;
                    const isEven = index % 2 === 0;

                    return (
                        <g key={index}>
                            <rect
                                x={0}
                                y={y}
                                width={canvasWidth}
                                height={rowHeight}
                                fill={isEven ? "rgba(28, 28, 31, 0.48)" : "rgba(18, 18, 20, 0.25)"}
                            />
                            <text
                                x={24}
                                y={y + rowHeight / 2 + 5}
                                fill="#94a3b8"
                                fontSize={16}
                                fontWeight={600}
                            >
                                {`${index + 1}`}
                            </text>
                        </g>
                    );
                })}

                <line
                    x1={OFFSET_X - 22}
                    y1={OFFSET_Y - 12}
                    x2={OFFSET_X - 22}
                    y2={canvasHeight - OFFSET_Y + 8}
                    stroke="#334155"
                    strokeWidth={1.2}
                />

                {connections.map((c, i) => (
                    <PrerequisiteLine
                        key={i}
                        {...c}
                        resolved={state.concluidas.includes(c.from.id)}
                    />
                ))}

                {nodes.map(node => {
                    const status = calcularStatus(node, state);
                    const action = nextActionByStatus(status, node.id);

                    return (
                        <DisciplineCard
                            key={node.id}
                            node={node}
                            status={status}
                            onClick={() => action && dispatch(action)}
                        />
                    );
                })}
            </svg>
            </div>
        </div>
    );
}
