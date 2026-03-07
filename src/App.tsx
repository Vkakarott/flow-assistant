"use client";

import { useEffect, useMemo, useReducer } from "react";
import { useRef } from "react";
import { useSession } from "next-auth/react";

import { AppLayout } from "./components/layout/AppLayout";
import { Sidebar } from "./components/panels/Sidebar";
import { CourseDiagram } from "./ui/diagram/CourseDiagram";

import {
  academicReducer,
  initialAcademicState
} from "./core/state";

import { calcularPeriodoEfetivo } from "./core/academic";
import { loadAcademicState, saveAcademicState } from "./core/persistence";
import { DATA } from "./core";
import { calcularStatus } from "./core/status";

function App() {
  const { data: session, status } = useSession();
  const userScope = session?.user?.email ?? session?.user?.name ?? "guest";
  const isHydratedRef = useRef(false);

  const [state, dispatch] = useReducer(
    academicReducer,
    initialAcademicState
  );

  const periodoEfetivo = calcularPeriodoEfetivo(state);

  useEffect(() => {
    if (status === "loading") return;

    const loadedState = loadAcademicState(userScope) ?? initialAcademicState;
    dispatch({ type: "HYDRATE", state: loadedState });
    isHydratedRef.current = true;
  }, [status, userScope]);

  useEffect(() => {
    if (status === "loading" || !isHydratedRef.current) return;
    saveAcademicState(state, userScope);
  }, [state, status, userScope]);

  const resumo = useMemo(() => {
    let concluidas = 0;
    let cursando = 0;
    let bloqueadas = 0;
    let disponiveis = 0;

    DATA.disciplinas.forEach((disciplina) => {
      const status = calcularStatus(disciplina, state);

      if (status === "concluida") concluidas += 1;
      if (status === "cursando") cursando += 1;
      if (status === "bloqueada") bloqueadas += 1;
      if (status === "disponivel") disponiveis += 1;
    });

    return {
      concluidas,
      cursando,
      bloqueadas,
      pendentes: disponiveis + bloqueadas
    };
  }, [state]);

  return (
    <AppLayout
      main={
        <CourseDiagram
          state={state}
          dispatch={dispatch}
        />
      }
      sidebar={
        <Sidebar
          periodo={periodoEfetivo}
          offset={state.periodoOffset}
          concluidas={resumo.concluidas}
          cursando={resumo.cursando}
          pendentes={resumo.pendentes}
          bloqueadas={resumo.bloqueadas}
          total={DATA.disciplinas.length}
          onChangeOffset={(value) =>
            dispatch({
              type: "SET_PERIODO_OFFSET",
              value
            })
          }
        />
      }
    />
  );
}

export default App;
