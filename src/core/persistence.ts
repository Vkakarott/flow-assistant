import type { AcademicState } from "./state";
import { initialAcademicState } from "./state";

const KEY = "flow-assistant:academic";
const FLOW_SELECTION_KEY = "flow-assistant:selected-flow";

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

function buildFlowSelectionKey(scope?: string): string {
    return scope ? `${FLOW_SELECTION_KEY}:${scope}` : FLOW_SELECTION_KEY;
}

export function loadSelectedFlow(scope?: string): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    const value = localStorage.getItem(buildFlowSelectionKey(scope));
    if (!value) {
        return null;
    }

    return value;
}

export function saveSelectedFlow(flowCode: string, scope?: string) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(buildFlowSelectionKey(scope), flowCode);
}

export function listStoredFlowCodes(accountScope: string): string[] {
    if (typeof window === "undefined") {
        return [];
    }

    const prefix = `${KEY}:${accountScope}:`;
    const results = new Set<string>();

    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (!key || !key.startsWith(prefix)) {
            continue;
        }

        const flowCode = key.slice(prefix.length);
        if (flowCode) {
            results.add(flowCode);
        }
    }

    return Array.from(results).sort((a, b) => a.localeCompare(b));
}
