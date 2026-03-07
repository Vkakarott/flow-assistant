"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      username,
      password,
      callbackUrl: "/",
      redirect: false
    });

    if (!result || result.error) {
      setError("Usuário ou senha inválidos.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = result.url ?? "/";
  }

  return (
    <form
      className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-4"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold text-slate-100">Entrar</h1>

      <div className="space-y-1">
        <label htmlFor="username" className="text-sm text-slate-300">
          Usuário
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm text-slate-300">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-sky-600 hover:bg-sky-500 disabled:opacity-60 px-3 py-2 text-white font-medium"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-xs text-slate-400">
        Usuário padrão: <code>admin</code> | Senha padrão: <code>admin123</code>
      </p>

      <Link href="/" className="inline-block text-sm text-slate-300 hover:text-slate-100">
        Voltar ao assistente
      </Link>
    </form>
  );
}
