export interface Ingresso {
    ano: number;
    semestre: 1 | 2;
}

export interface AcademicState {
    ingresso: Ingresso;
    periodoOffset: number;
    concluidas: number[];
    cursando: number[];
}

export const initialAcademicState: AcademicState = {
    ingresso: { ano: 2023, semestre: 2 },
    periodoOffset: 0,
    concluidas: [],
    cursando: []
};

export type AcademicAction =
    | { type: "SET_PERIODO_OFFSET"; value: number }
    | { type: "MARK_CURSANDO"; id: number }
    | { type: "MARK_CONCLUIDA"; id: number }
    | { type: "MARK_PENDENTE"; id: number }
    | { type: "HYDRATE"; state: AcademicState };

function unique(values: number[]): number[] {
    return [...new Set(values)];
}

function without(values: number[], id: number): number[] {
    return values.filter(value => value !== id);
}

export function academicReducer(
    state: AcademicState,
    action: AcademicAction
): AcademicState {
    switch (action.type) {
        case "SET_PERIODO_OFFSET":
            return {
                ...state,
                periodoOffset: action.value
            };

        case "MARK_CURSANDO":
            return {
                ...state,
                concluidas: without(state.concluidas, action.id),
                cursando: unique([...state.cursando, action.id])
            };

        case "MARK_CONCLUIDA":
            return {
                ...state,
                cursando: without(state.cursando, action.id),
                concluidas: unique([...state.concluidas, action.id])
            };

        case "MARK_PENDENTE":
            return {
                ...state,
                cursando: without(state.cursando, action.id),
                concluidas: without(state.concluidas, action.id)
            };

        case "HYDRATE":
            return {
                ...action.state,
                concluidas: unique(action.state.concluidas),
                cursando: unique(
                    action.state.cursando.filter(
                        id => !action.state.concluidas.includes(id)
                    )
                )
            };

        default:
            return state;
    }
}
