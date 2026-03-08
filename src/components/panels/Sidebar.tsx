import { PeriodoControl } from "./PeriodoControl";
import { AuthCard } from "./AuthCard";
import { useState } from "react";

interface SidebarProps {
    selectedFlowCode: string | null;
    flowOptions: Array<{ code: string; label: string }>;
    isLoadingCatalog: boolean;
    isLoadingDisciplinas: boolean;
    onSelectFlow: (flowCode: string) => void;
    periodo: number;
    offset: number;
    concluidas: number;
    cursando: number;
    pendentes: number;
    bloqueadas: number;
    pendentesDisponiveis: string[];
    total: number;
    onChangeOffset: (value: number) => void;
}

export function Sidebar({
    selectedFlowCode,
    flowOptions,
    isLoadingCatalog,
    isLoadingDisciplinas,
    onSelectFlow,
    periodo,
    offset,
    concluidas,
    cursando,
    pendentes,
    bloqueadas,
    pendentesDisponiveis,
    total,
    onChangeOffset
}: SidebarProps) {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const panelClass = "rounded-lg border border-white/10 bg-black/35 p-3";

    return (
        <div className="space-y-3 p-2 sm:p-3">
            <div className={`${panelClass} space-y-2`}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Matriz atual
                </div>
                <select
                    className="w-full rounded-md border border-white/10 bg-black/60 px-2.5 py-2 text-sm text-slate-100 outline-none focus:border-white/30"
                    value={selectedFlowCode ?? ""}
                    onChange={(event) => onSelectFlow(event.target.value)}
                    disabled={isLoadingCatalog || flowOptions.length === 0}
                >
                    <option value="" disabled>
                        {isLoadingCatalog ? "Carregando matrizes..." : "Selecione uma matriz"}
                    </option>
                    {flowOptions.map((option) => (
                        <option key={option.code} value={option.code}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {isLoadingDisciplinas && (
                    <div className="text-xs text-slate-400/90">Carregando disciplinas da matriz...</div>
                )}
            </div>

            <AuthCard
                concluidas={concluidas}
                total={total}
            />

            <PeriodoControl
                periodo={periodo}
                offset={offset}
                onChange={onChangeOffset}
            />

            <div className={`${panelClass} space-y-2`}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Progresso
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-200">
                        Concluídas: {concluidas}
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-200">
                        Cursando: {cursando}
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-200">
                        Pendentes: {pendentes}
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-300">
                        Bloqueadas: {bloqueadas}
                    </div>
                </div>
            </div>

            <div className={`${panelClass} space-y-2`}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Pendentes (não bloqueadas)
                </div>
                {pendentesDisponiveis.length === 0 ? (
                    <div className="text-xs text-slate-400">Nenhuma pendente disponível.</div>
                ) : (
                    <ul className="max-h-44 space-y-1 overflow-auto pr-1 text-xs text-slate-300">
                        {pendentesDisponiveis.map((nome) => (
                            <li key={nome} className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
                                {nome}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                type="button"
                onClick={() => setIsHelpOpen(true)}
                className="ml-auto inline-flex rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
            >
                Ajuda
            </button>

            {isHelpOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0f0f11] p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-100">Como usar</h2>
                            <button
                                type="button"
                                onClick={() => setIsHelpOpen(false)}
                                className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/10"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="space-y-2 text-xs text-slate-300">
                            <div>Clique na disciplina disponível para marcar como cursando.</div>
                            <div>Clique novamente para marcar como concluída.</div>
                            <div>Disciplinas bloqueadas liberam ao concluir pré-requisitos.</div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                Cores
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="inline-block h-3 w-3 rounded-sm border border-emerald-400 bg-emerald-900/40" />
                                Concluída
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="inline-block h-3 w-3 rounded-sm border border-sky-400 bg-sky-900/40" />
                                Cursando
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="inline-block h-3 w-3 rounded-sm border border-amber-400 bg-amber-900/40" />
                                Disponível
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="inline-block h-3 w-3 rounded-sm border border-slate-700 bg-slate-900" />
                                Bloqueada
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
