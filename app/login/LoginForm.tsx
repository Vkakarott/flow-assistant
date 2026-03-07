"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: false
    });

    if (!result || result.error) {
      setError("Email ou senha inválidos.");
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
      <p className="text-xs text-slate-400">
        Se o email não existir, uma conta será criada automaticamente.
      </p>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-slate-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
        {isSubmitting ? "Entrando..." : "Entrar / Criar conta"}
      </button>

      <Link href="/" className="inline-block text-sm text-slate-300 hover:text-slate-100">
        Voltar ao assistente
      </Link>
    </form>
  );
}
