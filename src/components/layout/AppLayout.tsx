"use client";

import { useState } from "react";

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
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100">
            <div className="relative flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-hidden">
                    {main}
                </main>

                {isSidebarCollapsed && (
                    <button
                        type="button"
                        onClick={() => setIsSidebarCollapsed(false)}
                        aria-label="Expandir sidebar"
                        className="absolute right-3 top-4 z-30 h-8 w-8 rounded-full border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    >
                        ◀
                    </button>
                )}

                <aside
                    className={`relative shrink-0 overflow-hidden bg-slate-950 transition-[width] duration-200 ${
                        isSidebarCollapsed
                            ? "w-0 border-l-0"
                            : "w-80 border-l border-slate-800"
                    }`}
                >
                    {!isSidebarCollapsed && (
                        <button
                            type="button"
                            onClick={() => setIsSidebarCollapsed(true)}
                            aria-label="Retrair sidebar"
                            className="absolute left-0 top-4 -translate-x-1/2 z-20 h-8 w-8 rounded-full border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                        >
                            ▶
                        </button>
                    )}

                    <div
                        className={`h-full overflow-auto transition-opacity duration-150 ${
                            isSidebarCollapsed
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                        }`}
                    >
                        {sidebar}
                    </div>
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
