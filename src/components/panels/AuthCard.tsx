"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

interface AuthCardProps {
  total: number;
  concluidas: number;
  cursando: number;
}

export function AuthCard({ total, concluidas, cursando }: AuthCardProps) {
  const { data: session, status } = useSession();
  const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  if (status === "loading") {
    return (
      <div className="rounded-lg border border-white/10 bg-black/35 p-3">
        <div className="text-xs text-slate-400">Carregando perfil...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/35 p-3 space-y-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Conta</div>
        <div className="text-xs text-slate-300">
          Faça login para vincular e salvar seu progresso.
        </div>
        <Link
          href="/login"
          className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
        >
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/35 p-3 space-y-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Conta vinculada</div>
      <div className="text-xs text-slate-300">
        {session.user?.name ?? "Usuário"} ({session.user?.email ?? "sem email"})
      </div>
      <div className="text-xs text-slate-300">
        Cursos salvos: 1
      </div>
      <div className="text-xs text-slate-300">
        Progresso geral: {progresso}% ({concluidas}/{total})
      </div>
      <div className="text-xs text-slate-300">
        Em andamento: {cursando}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/nova-matriz"
          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
        >
          Nova matriz
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-md border border-rose-400/20 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-500/20"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
