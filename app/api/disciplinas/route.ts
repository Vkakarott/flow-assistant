import { NextResponse } from "next/server";
import { getCurriculumItems } from "../../../src/server/curriculum";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const curriculumCode = searchParams.get("curriculum") ?? "cc-2017";
  const disciplinas = await getCurriculumItems(curriculumCode);

  return NextResponse.json({
    curriculum: curriculumCode,
    total: disciplinas.length,
    disciplinas
  });
}
