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
import { calcularStatus } from "./core/status";
import type { Disciplina } from "./core/types";

interface AppProps {
  disciplinas: Disciplina[];
  flowCode: string;
}

function App({ disciplinas, flowCode }: AppProps) {
  const { data: session, status } = useSession();
  const accountScope = session?.user?.email ?? session?.user?.name ?? "guest";
  const userScope = `${accountScope}:${flowCode}`;
  const isHydratedRef = useRef(false);

  const [state, dispatch] = useReducer(
    academicReducer,
    initialAcademicState
  );

  const periodoEfetivo = calcularPeriodoEfetivo(state);

  useEffect(() => {
    if (status === "loading") return;

    isHydratedRef.current = false;

    const hydrate = async () => {
      let loadedState = loadAcademicState(userScope);

      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/progress?flowCode=${encodeURIComponent(flowCode)}`, {
            cache: "no-store"
          });
          if (response.ok) {
            const data = (await response.json()) as { state: typeof loadedState };
            if (data.state) {
              loadedState = data.state;
            }
          }
        } catch {
          // fallback to local storage
        }
      }

      dispatch({ type: "HYDRATE", state: loadedState ?? initialAcademicState });
      isHydratedRef.current = true;
    };

    void hydrate();
  }, [status, userScope, flowCode]);

  useEffect(() => {
    if (status === "loading" || !isHydratedRef.current) return;
    saveAcademicState(state, userScope);

    if (status === "authenticated") {
      void fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, flowCode })
      });
    }
  }, [state, status, userScope, flowCode]);

  const resumo = useMemo(() => {
    let concluidas = 0;
    let cursando = 0;
    let bloqueadas = 0;
    let disponiveis = 0;

    disciplinas.forEach((disciplina) => {
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
  }, [state, disciplinas]);

  return (
    <AppLayout
      main={
        <CourseDiagram
          state={state}
          dispatch={dispatch}
          disciplinas={disciplinas}
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
          total={disciplinas.length}
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
