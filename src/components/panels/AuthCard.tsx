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
      <div className="rounded-lg border border-slate-700 p-3 space-y-2 bg-slate-900">
        <div className="text-sm text-slate-400">Carregando perfil...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-lg border border-slate-700 p-3 space-y-3 bg-slate-900">
        <div className="text-sm font-semibold text-slate-100">Conta</div>
        <div className="text-xs text-slate-300">
          Faça login para vincular e salvar seu progresso.
        </div>
        <Link
          href="/login"
          className="inline-block rounded-md bg-sky-600 hover:bg-sky-500 px-3 py-2 text-sm text-white"
        >
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 p-3 space-y-3 bg-slate-900">
      <div className="text-sm font-semibold text-slate-100">Conta vinculada</div>
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
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-md bg-rose-600 hover:bg-rose-500 px-3 py-2 text-sm text-white"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
