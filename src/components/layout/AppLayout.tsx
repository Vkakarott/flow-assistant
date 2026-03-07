interface AppLayoutProps {
    sidebar: React.ReactNode;
    main: React.ReactNode;
    footer?: React.ReactNode;
}

export function AppLayout({
    sidebar,
    main,
    footer
}: AppLayoutProps) {
    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100">
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-hidden">
                    {main}
                </main>
        
                <aside className="w-80 shrink-0 overflow-auto border-l border-slate-800 bg-slate-950">
                    {sidebar}
                </aside>
            </div>
    
            {footer && (
                <footer className="shrink-0 border-t border-slate-800 bg-slate-900 text-slate-300">
                    {footer}
                </footer>
            )}
        </div>
    );
}
