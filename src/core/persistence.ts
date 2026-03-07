import type { AcademicState } from "./state";
import { initialAcademicState } from "./state";

const KEY = "flow-assistant:academic";

function buildKey(scope?: string): string {
    return scope ? `${KEY}:${scope}` : KEY;
}

function isNumberArray(value: unknown): value is number[] {
    return Array.isArray(value) && value.every(item => typeof item === "number");
}

export function loadAcademicState(scope?: string): AcademicState | null {
    if (typeof window === "undefined") {
        return null;
    }

    const raw = localStorage.getItem(buildKey(scope));

    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw) as Partial<AcademicState>;

        if (
            !parsed.ingresso ||
            typeof parsed.ingresso.ano !== "number" ||
            (parsed.ingresso.semestre !== 1 && parsed.ingresso.semestre !== 2) ||
            typeof parsed.periodoOffset !== "number" ||
            !isNumberArray(parsed.concluidas) ||
            !isNumberArray(parsed.cursando)
        ) {
            return null;
        }

        return {
            ...initialAcademicState,
            ...parsed
        };
    } catch {
        return null;
    }
}

export function saveAcademicState(state: AcademicState, scope?: string) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(buildKey(scope), JSON.stringify(state));
}
