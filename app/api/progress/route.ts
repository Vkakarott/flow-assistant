import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/auth/options";
import { DEFAULT_FLOW_CODE } from "../../../src/config/flow";
import type { AcademicState } from "../../../src/core/state";
import { initialAcademicState } from "../../../src/core/state";
import { getSupabaseServiceClient } from "../../../src/lib/supabase/server";

interface ProgressRow {
  user_identifier: string;
  flow_code: string;
  ingresso_ano: number;
  ingresso_semestre: 1 | 2;
  periodo_offset: number;
  concluidas: number[] | null;
  cursando: number[] | null;
}

function toAcademicState(row: ProgressRow): AcademicState {
  return {
    ingresso: {
      ano: row.ingresso_ano,
      semestre: row.ingresso_semestre
    },
    periodoOffset: row.periodo_offset,
    concluidas: row.concluidas ?? [],
    cursando: row.cursando ?? []
  };
}

async function getUserIdentifier() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? session?.user?.name ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flowCode = searchParams.get("flowCode") ?? DEFAULT_FLOW_CODE;
  const userIdentifier = await getUserIdentifier();

  if (!userIdentifier) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("user_flow_progress")
    .select(
      "user_identifier, flow_code, ingresso_ano, ingresso_semestre, periodo_offset, concluidas, cursando"
    )
    .eq("user_identifier", userIdentifier)
    .eq("flow_code", flowCode)
    .single();

  if (error || !data) {
    return NextResponse.json({ state: null });
  }

  return NextResponse.json({ state: toAcademicState(data as ProgressRow) });
}

export async function PUT(request: Request) {
  const userIdentifier = await getUserIdentifier();

  if (!userIdentifier) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { state?: AcademicState; flowCode?: string };
  const state = body.state ?? initialAcademicState;
  const flowCode = body.flowCode ?? DEFAULT_FLOW_CODE;

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("user_flow_progress").upsert(
    {
      user_identifier: userIdentifier,
      flow_code: flowCode,
      ingresso_ano: state.ingresso.ano,
      ingresso_semestre: state.ingresso.semestre,
      periodo_offset: state.periodoOffset,
      concluidas: state.concluidas,
      cursando: state.cursando
    },
    { onConflict: "user_identifier,flow_code" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
