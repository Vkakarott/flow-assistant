"use client";

import { useState } from "react";

const EXAMPLE_JSON = `[
  {
    "id": 1,
    "nome": "Introdução",
    "periodoIdeal": 1,
    "preRequisitos": [],
    "cargaHoraria": 64,
    "creditos": 4,
    "tipo": "obrigatoria"
  }
]`;

export function NewMatrixForm() {
  const [flowCode, setFlowCode] = useState("");
  const [jsonText, setJsonText] = useState(EXAMPLE_JSON);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    let disciplinas: unknown;
    try {
      disciplinas = JSON.parse(jsonText);
    } catch {
      setError("JSON inválido. Verifique a estrutura.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowCode: flowCode.trim(),
          disciplinas
        })
      });

      const data = (await response.json()) as {
        ok?: boolean;
        flowCode?: string;
        inserted?: number;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Falha ao subir matriz.");
        return;
      }

      setMessage(
        `Matriz ${data.flowCode} salva com sucesso (${data.inserted} disciplinas).`
      );
    } catch {
      setError("Erro de rede ao salvar matriz.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-3xl space-y-4 rounded-xl border border-white/10 bg-black/45 p-5 backdrop-blur"
    >
      <div>
        <h1 className="text-lg font-semibold text-slate-100">Nova matriz</h1>
        <p className="mt-1 text-sm text-slate-400/90">
          Envie um `flowCode` e um JSON no formato de `disciplinas`.
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="flowCode" className="text-sm text-slate-300">
          Código da matriz
        </label>
        <input
          id="flowCode"
          type="text"
          value={flowCode}
          onChange={(event) => setFlowCode(event.target.value)}
          placeholder="ex: cc-2017"
          className="w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-slate-100 outline-none focus:border-sky-500"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="matrixJson" className="text-sm text-slate-300">
          JSON da matriz
        </label>
        <textarea
          id="matrixJson"
          value={jsonText}
          onChange={(event) => setJsonText(event.target.value)}
          className="min-h-[320px] w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 font-mono text-xs text-slate-100 outline-none focus:border-sky-500"
          spellCheck={false}
          required
        />
      </div>

      {message && <p className="text-sm text-emerald-300">{message}</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : "Salvar matriz"}
      </button>
    </form>
  );
}
