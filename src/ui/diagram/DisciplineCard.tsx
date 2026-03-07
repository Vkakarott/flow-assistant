import type { PositionedDisciplina } from "../../core/diagram/layout";
import type { DisciplinaStatus } from "../../core/status";
import { CARD_HEIGHT, CARD_WIDTH } from "../../core/diagram/layout";

interface Props {
    node: PositionedDisciplina;
    status: DisciplinaStatus;
    onClick: () => void;
}

function getStyle(status: Props["status"]) {
    switch (status) {
        case "concluida":
            return {
                bg: "#10261c",
                border: "#34d399",
                text: "#d1fae5",
                chip: "#065f46"
            };
        case "cursando":
            return {
                bg: "#0d2233",
                border: "#38bdf8",
                text: "#dbeafe",
                chip: "#075985"
            };
        case "disponivel":
            return {
                bg: "#33270f",
                border: "#facc15",
                text: "#fef3c7",
                chip: "#92400e"
            };
        default:
            return {
                bg: "#111827",
                border: "#334155",
                text: "#94a3b8",
                chip: "#1e293b"
            };
    }
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
        const test = current ? `${current} ${word}` : word;

        if (test.length > maxCharsPerLine) {
            if (current) {
                lines.push(current);
            }
            current = word;
        } else {
            current = test;
        }
    }

    if (current) lines.push(current);
    return lines;
}

export function DisciplineCard({ node, status, onClick }: Props) {
    const style = getStyle(status);
    const lines = wrapText(node.nome, 18);

    const lineHeight = 14;
    const totalTextHeight = lines.length * lineHeight;
    const startY = node.y + CARD_HEIGHT / 2 - totalTextHeight / 2 + lineHeight - 2;
    const clickable = status !== "bloqueada";
    return (
        <g
            cursor={clickable ? "pointer" : "not-allowed"}
            opacity={clickable ? 1 : 0.8}
            onClick={() => clickable && onClick()}
        >
            <rect
                x={node.x}
                y={node.y}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                rx={12}
                ry={12}
                fill={style.bg}
                stroke={style.border}
                strokeWidth={1.8}
            />

            <text
                x={node.x + CARD_WIDTH / 2}
                textAnchor="middle"
                fontSize={12}
                fill={style.text}
                fontWeight={500}
            >
                {lines.map((line, i) => (
                    <tspan
                        key={i}
                        x={node.x + CARD_WIDTH / 2}
                        y={startY + i * lineHeight}
                    >
                        {line}
                    </tspan>
                ))}
            </text>
        </g>
    );
}
