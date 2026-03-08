"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
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
import {
  loadAcademicState,
  loadSelectedFlow,
  saveAcademicState,
  saveSelectedFlow
} from "./core/persistence";
import { calcularStatus } from "./core/status";
import type { Disciplina } from "./core/types";

interface FlowCatalogResponse {
  systemFlowCodes: string[];
  userFlowCodes: string[];
}

interface DisciplinasResponse {
  flowCode: string;
  disciplinas: Disciplina[];
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function formatFlowLabel(flowCode: string): string {
  return flowCode.replace(/[-_]/g, " ").toUpperCase();
}

function App() {
  const { data: session, status } = useSession();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [availableFlowCodes, setAvailableFlowCodes] = useState<string[]>([]);
  const [selectedFlowCode, setSelectedFlowCode] = useState<string | null>(null);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [isLoadingDisciplinas, setIsLoadingDisciplinas] = useState(false);

  const accountScope = session?.user?.email ?? session?.user?.name ?? "guest";
  const userScope = selectedFlowCode ? `${accountScope}:${selectedFlowCode}` : null;
  const isHydratedRef = useRef(false);

  const [state, dispatch] = useReducer(
    academicReducer,
    initialAcademicState
  );

  const periodoEfetivo = calcularPeriodoEfetivo(state);

  useEffect(() => {
    if (status === "loading") return;

    const loadCatalog = async () => {
      setIsLoadingCatalog(true);

      let systemFlowCodes: string[] = [];
      let userFlowCodes: string[] = [];

      try {
        const response = await fetch("/api/flows", { cache: "no-store" });
        if (response.ok) {
          const data = (await response.json()) as FlowCatalogResponse;
          systemFlowCodes = data.systemFlowCodes ?? [];
          userFlowCodes = data.userFlowCodes ?? [];
        }
      } catch {
        // ignore and use local data fallback
      }

      const catalogFlowCodes = uniqueSorted([
        ...systemFlowCodes,
        ...userFlowCodes
      ]);

      setAvailableFlowCodes(catalogFlowCodes);

      const rememberedFlow = loadSelectedFlow(accountScope);
      const selected = rememberedFlow && catalogFlowCodes.includes(rememberedFlow)
        ? rememberedFlow
        : null;

      setSelectedFlowCode(selected);
      setIsLoadingCatalog(false);
    };

    void loadCatalog();
  }, [status, accountScope]);

  useEffect(() => {
    if (!selectedFlowCode) {
      setDisciplinas([]);
      return;
    }

    saveSelectedFlow(selectedFlowCode, accountScope);
    setIsLoadingDisciplinas(true);

    const loadDisciplinas = async () => {
      try {
        const response = await fetch(
          `/api/disciplinas?flow=${encodeURIComponent(selectedFlowCode)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          setDisciplinas([]);
          return;
        }

        const data = (await response.json()) as DisciplinasResponse;
        setDisciplinas(data.disciplinas ?? []);
      } catch {
        setDisciplinas([]);
      } finally {
        setIsLoadingDisciplinas(false);
      }
    };

    void loadDisciplinas();
  }, [selectedFlowCode, accountScope]);

  useEffect(() => {
    if (status === "loading") return;
    if (!selectedFlowCode || !userScope) return;

    isHydratedRef.current = false;

    const hydrate = async () => {
      let loadedState = loadAcademicState(userScope);

      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/progress?flowCode=${encodeURIComponent(selectedFlowCode)}`, {
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
  }, [status, userScope, selectedFlowCode]);

  useEffect(() => {
    if (!selectedFlowCode || !userScope) return;
    if (status === "loading" || !isHydratedRef.current) return;

    saveAcademicState(state, userScope);

    if (status === "authenticated") {
      void fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, flowCode: selectedFlowCode })
      });
    }
  }, [state, status, userScope, selectedFlowCode]);

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

  const flowOptions = useMemo(
    () => availableFlowCodes.map((code) => ({ code, label: formatFlowLabel(code) })),
    [availableFlowCodes]
  );

  const pendentesDisponiveis = useMemo(
    () =>
      disciplinas
        .filter((disciplina) => calcularStatus(disciplina, state) === "disponivel")
        .sort((a, b) => a.id - b.id)
        .map((disciplina) => disciplina.nome),
    [disciplinas, state]
  );

  return (
    <AppLayout
      main={
        selectedFlowCode ? (
          <CourseDiagram
            state={state}
            dispatch={dispatch}
            disciplinas={disciplinas}
          />
        ) : (
          <div className="theme-bg h-full w-full flex items-center justify-center p-6">
            <div className="theme-panel max-w-xl w-full rounded-xl p-6">
              <div className="text-lg font-semibold text-slate-100">
                Nenhuma matriz selecionada
              </div>
              <div className="mt-2 text-sm text-slate-300">
                Selecione uma matriz na barra lateral para carregar o diagrama.
              </div>
            </div>
          </div>
        )
      }
      sidebar={
          <Sidebar
            selectedFlowCode={selectedFlowCode}
            flowOptions={flowOptions}
            isLoadingCatalog={isLoadingCatalog}
            isLoadingDisciplinas={isLoadingDisciplinas}
            onSelectFlow={setSelectedFlowCode}
          periodo={periodoEfetivo}
          offset={state.periodoOffset}
          concluidas={resumo.concluidas}
          cursando={resumo.cursando}
          pendentes={resumo.pendentes}
          bloqueadas={resumo.bloqueadas}
          pendentesDisponiveis={pendentesDisponiveis}
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
