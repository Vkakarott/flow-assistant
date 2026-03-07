import { calcularPeriodoAtual } from "./periodo";
import type { AcademicState } from "./state";

export function calcularPeriodoEfetivo(
  state: AcademicState,
  referencia?: Date
): number {
  return (
    calcularPeriodoAtual(state.ingresso, referencia) +
    state.periodoOffset
  );
}
