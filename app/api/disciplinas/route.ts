import { NextResponse } from "next/server";
import { getFlowItems } from "../../../src/server/flow";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flowCode =
    searchParams.get("flow") ?? searchParams.get("curriculum") ?? "";
  const disciplinas = await getFlowItems(flowCode);

  return NextResponse.json({
    flowCode,
    total: disciplinas.length,
    disciplinas
  });
}
