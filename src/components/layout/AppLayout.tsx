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
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#0a0a0b] text-slate-100">
            <div className="relative flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-hidden">
                    {main}
                </main>

                {isSidebarCollapsed && (
                    <button
                        type="button"
                        onClick={() => setIsSidebarCollapsed(false)}
                        aria-label="Expandir sidebar"
                        className="absolute right-3 top-4 z-30 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/70 text-slate-200 backdrop-blur hover:bg-black/85"
                    >
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                            <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}

                <aside
                    className={`relative shrink-0 overflow-hidden border-l border-white/10 bg-black/65 backdrop-blur transition-[width] duration-200 ${
                        isSidebarCollapsed
                            ? "w-0 border-l-0"
                            : "w-72 xl:w-80"
                    }`}
                >
                    {!isSidebarCollapsed && (
                        <button
                            type="button"
                            onClick={() => setIsSidebarCollapsed(true)}
                            aria-label="Retrair sidebar"
                            className="absolute left-0 top-4 z-20 -translate-x-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/70 text-slate-200 backdrop-blur hover:bg-black/85"
                        >
                            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
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
                <footer className="shrink-0 border-t border-white/10 bg-black/70 text-slate-300">
                    {footer}
                </footer>
            )}
        </div>
    );
}
