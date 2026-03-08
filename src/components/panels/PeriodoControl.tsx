interface Props {
    periodo: number;
    offset: number;
    onChange: (value: number) => void;
}

export function PeriodoControl({ periodo, offset, onChange }: Props) {
    return (
        <div className="rounded-lg border border-white/10 bg-black/35 p-3">
            <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Período atual
                </div>
                <button
                    onClick={() => onChange(offset - 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/60 text-slate-200 hover:bg-black/80"
                >
                    −
                </button>
        
                <span className="min-w-8 text-center text-base font-semibold text-slate-100">
                    {periodo}
                </span>
        
                <button
                    onClick={() => onChange(offset + 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/60 text-slate-200 hover:bg-black/80"
                >
                    +
                </button>
            </div>
        </div>
    );
}
