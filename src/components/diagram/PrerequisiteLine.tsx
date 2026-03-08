import { CARD_HEIGHT, CARD_WIDTH, GAP_X, GAP_Y } from "../../core/diagram/layout";

interface LineProps {
    from: { x: number; y: number };
    to: { x: number; y: number };
    resolved?: boolean;
    laneShiftX?: number;
    laneShiftY?: number;
}

export function PrerequisiteLine({
    from,
    to,
    resolved = false,
    laneShiftX = 0,
    laneShiftY = 0
}: LineProps) {
    const fromBottom = { x: from.x + CARD_WIDTH / 2, y: from.y + CARD_HEIGHT };
    const toTop = { x: to.x + CARD_WIDTH / 2, y: to.y };
    const goesDown = to.y > from.y;
    const alignedColumn = Math.abs(from.x - to.x) <= 2;

    // Dependencies in this matrix always go to later periods. Keep the route on corridor lanes:
    // source bottom -> row lane -> column lane -> destination row lane -> destination top.
    const startLaneY = from.y + CARD_HEIGHT + GAP_Y / 2 + laneShiftY;
    const endLaneY = to.y - GAP_Y / 2 + laneShiftY;
    const rightLaneX = to.x + CARD_WIDTH + GAP_X / 2;
    const leftLaneX = to.x - GAP_X / 2;
    const laneX = (fromBottom.x < toTop.x ? leftLaneX : rightLaneX) + laneShiftX;

    const corridorPath = [
        `M ${fromBottom.x} ${fromBottom.y}`,
        `L ${fromBottom.x} ${startLaneY}`,
        `L ${laneX} ${startLaneY}`,
        `L ${laneX} ${endLaneY}`,
        `L ${toTop.x} ${endLaneY}`,
        `L ${toTop.x} ${toTop.y}`
    ].join(" ");

    const verticalPath = [
        `M ${fromBottom.x} ${fromBottom.y}`,
        `L ${fromBottom.x} ${startLaneY}`,
        `L ${toTop.x} ${startLaneY}`,
        `L ${toTop.x} ${toTop.y}`
    ].join(" ");
    const path = !goesDown
        ? `M ${fromBottom.x} ${fromBottom.y} L ${toTop.x} ${toTop.y}`
        : alignedColumn
            ? verticalPath
            : corridorPath;
    const opacity = resolved ? 0.5 : 0.95;

    return (
        <path
            d={path}
            fill="none"
            stroke={resolved ? "#64748b" : "#94a3b8"}
            opacity={opacity}
            strokeWidth={1.8}
            markerEnd="url(#arrow)"
        />
    );
}
