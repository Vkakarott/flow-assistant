import { NextResponse } from "next/server";
import disciplinas from "../../../src/data/disciplinas.json";

export async function GET() {
  return NextResponse.json({
    total: disciplinas.length,
    disciplinas
  });
}
