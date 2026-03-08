import { PeriodoControl } from "./PeriodoControl";
import { AuthCard } from "./AuthCard";

interface SidebarProps {
    selectedFlowCode: string | null;
    flowOptions: Array<{ code: string; label: string }>;
    flowSource: "user" | "system";
    isLoadingCatalog: boolean;
    isLoadingDisciplinas: boolean;
    onSelectFlow: (flowCode: string) => void;
    periodo: number;
    offset: number;
    concluidas: number;
    cursando: number;
    pendentes: number;
    bloqueadas: number;
    total: number;
    onChangeOffset: (value: number) => void;
}

export function Sidebar({
    selectedFlowCode,
    flowOptions,
    flowSource,
    isLoadingCatalog,
    isLoadingDisciplinas,
    onSelectFlow,
    periodo,
    offset,
    concluidas,
    cursando,
    pendentes,
    bloqueadas,
    total,
    onChangeOffset
}: SidebarProps) {
    const panelClass = "rounded-lg border border-white/10 bg-black/35 p-3";

    return (
        <div className="space-y-3 p-3">
            <div className={`${panelClass} space-y-2`}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Matriz atual
                </div>
                <select
                    className="w-full rounded-md border border-white/10 bg-black/60 px-2.5 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
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
                <div className="text-xs text-slate-400/90">
                    {flowSource === "user"
                        ? "Exibindo matrizes do usuário (banco + storage)."
                        : "Exibindo matrizes padrão do sistema."}
                </div>
                {isLoadingDisciplinas && (
                    <div className="text-xs text-slate-400/90">Carregando disciplinas da matriz...</div>
                )}
            </div>

            <AuthCard
                concluidas={concluidas}
                cursando={cursando}
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
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border border-emerald-400/20 bg-emerald-500/5 px-2 py-1 text-emerald-200">
                        Concluídas: {concluidas}
                    </div>
                    <div className="rounded-md border border-sky-400/20 bg-sky-500/5 px-2 py-1 text-sky-200">
                        Cursando: {cursando}
                    </div>
                    <div className="rounded-md border border-amber-400/20 bg-amber-500/5 px-2 py-1 text-amber-100">
                        Pendentes: {pendentes}
                    </div>
                    <div className="rounded-md border border-slate-500/20 bg-slate-500/5 px-2 py-1 text-slate-300">
                        Bloqueadas: {bloqueadas}
                    </div>
                </div>
            </div>

            <div className={`${panelClass} space-y-2`}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Legenda de cores
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
                    Disponível (pode cursar)
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="inline-block h-3 w-3 rounded-sm border border-slate-700 bg-slate-900" />
                    Bloqueada (falta pré-requisito)
                </div>
            </div>

            <div className={`${panelClass} space-y-2`}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Como usar
                </div>
                <div className="text-xs text-slate-300">
                    Clique na disciplina disponível para marcar como cursando.
                </div>
                <div className="text-xs text-slate-300">
                    Clique novamente para marcar como concluída.
                </div>
                <div className="text-xs text-slate-300">
                    Disciplinas bloqueadas só liberam após concluir pré-requisitos.
                </div>
            </div>
        </div>
    );
}
