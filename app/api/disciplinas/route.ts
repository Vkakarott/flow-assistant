import { NextResponse } from "next/server";
import { DEFAULT_FLOW_CODE } from "../../../src/config/flow";
import { getFlowItems } from "../../../src/server/flow";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flowCode =
    searchParams.get("flow") ?? searchParams.get("curriculum") ?? DEFAULT_FLOW_CODE;
  const disciplinas = await getFlowItems(flowCode);

  return NextResponse.json({
    flowCode,
    total: disciplinas.length,
    disciplinas
  });
}
