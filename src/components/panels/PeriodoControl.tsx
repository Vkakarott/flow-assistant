interface Props {
    periodo: number;
    offset: number;
    onChange: (value: number) => void;
}

export function PeriodoControl({ periodo, offset, onChange }: Props) {
    return (
        <div className="space-y-2 rounded-lg border border-slate-700 p-3 bg-slate-900">
            <div className="text-sm text-slate-300">
                Período atual
            </div>
    
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onChange(offset - 1)}
                    className="px-2 py-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
                >
                    −
                </button>
        
                <span className="text-lg font-semibold text-slate-100 min-w-8 text-center">
                    {periodo}
                </span>
        
                <button
                    onClick={() => onChange(offset + 1)}
                    className="px-2 py-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
                >
                    +
                </button>
            </div>
        </div>
    );
}
