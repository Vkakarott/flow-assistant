import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/auth/options";
import { DEFAULT_FLOW_CODE } from "../../../src/config/flow";
import type { AcademicState } from "../../../src/core/state";
import { initialAcademicState } from "../../../src/core/state";
import { prisma } from "../../../src/lib/prisma";

function toAcademicState(row: {
  ingressoAno: number;
  ingressoSemestre: number;
  periodoOffset: number;
  concluidas: number[];
  cursando: number[];
}): AcademicState {
  return {
    ingresso: {
      ano: row.ingressoAno,
      semestre: row.ingressoSemestre as 1 | 2
    },
    periodoOffset: row.periodoOffset,
    concluidas: row.concluidas ?? [],
    cursando: row.cursando ?? []
  };
}

async function getUserIdentifier() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? session?.user?.name ?? null;
}

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ state: null });
  }

  const { searchParams } = new URL(request.url);
  const flowCode = searchParams.get("flowCode") ?? DEFAULT_FLOW_CODE;
  const userIdentifier = await getUserIdentifier();

  if (!userIdentifier) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: Awaited<ReturnType<typeof prisma.userFlowProgress.findUnique>> = null;
  try {
    data = await prisma.userFlowProgress.findUnique({
      where: {
        userIdentifier_flowCode: {
          userIdentifier,
          flowCode
        }
      }
    });
  } catch {
    return NextResponse.json({ state: null, storage: "local-fallback" });
  }

  if (!data) {
    return NextResponse.json({ state: null });
  }

  return NextResponse.json({ state: toAcademicState(data) });
}

export async function PUT(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL not configured" }, { status: 503 });
  }

  const userIdentifier = await getUserIdentifier();

  if (!userIdentifier) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { state?: AcademicState; flowCode?: string };
  const state = body.state ?? initialAcademicState;
  const flowCode = body.flowCode ?? DEFAULT_FLOW_CODE;

  try {
    await prisma.userFlowProgress.upsert({
      where: {
        userIdentifier_flowCode: {
          userIdentifier,
          flowCode
        }
      },
      update: {
        ingressoAno: state.ingresso.ano,
        ingressoSemestre: state.ingresso.semestre,
        periodoOffset: state.periodoOffset,
        concluidas: state.concluidas,
        cursando: state.cursando
      },
      create: {
        userIdentifier,
        flowCode,
        ingressoAno: state.ingresso.ano,
        ingressoSemestre: state.ingresso.semestre,
        periodoOffset: state.periodoOffset,
        concluidas: state.concluidas,
        cursando: state.cursando
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      ok: false,
      storage: "local-fallback",
      error: message
    });
  }

  return NextResponse.json({ ok: true });
}
