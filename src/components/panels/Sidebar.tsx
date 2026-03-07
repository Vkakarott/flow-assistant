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
    return (
        <div className="p-4 space-y-4">
            <div className="rounded-lg border border-slate-700 p-3 space-y-2 bg-slate-900">
                <div className="text-sm font-semibold text-slate-100">
                    Matriz atual
                </div>
                <select
                    className="w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100 outline-none focus:border-sky-500"
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
                <div className="text-xs text-slate-400">
                    {flowSource === "user"
                        ? "Exibindo matrizes do usuário (banco + storage)."
                        : "Exibindo matrizes padrão do sistema."}
                </div>
                {isLoadingDisciplinas && (
                    <div className="text-xs text-slate-400">Carregando disciplinas da matriz...</div>
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

            <div className="rounded-lg border border-slate-700 p-3 space-y-2 bg-slate-900">
                <div className="text-sm font-semibold text-slate-100">
                    Progresso
                </div>
                <div className="text-sm text-slate-300">Concluídas: {concluidas}</div>
                <div className="text-sm text-sky-300">Cursando: {cursando}</div>
                <div className="text-sm text-amber-200">Pendentes: {pendentes}</div>
                <div className="text-sm text-slate-400">Bloqueadas: {bloqueadas}</div>
            </div>

            <div className="rounded-lg border border-slate-700 p-3 space-y-2 bg-slate-900">
                <div className="text-sm font-semibold text-slate-100">
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

            <div className="rounded-lg border border-slate-700 p-3 space-y-2 bg-slate-900">
                <div className="text-sm font-semibold text-slate-100">
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
