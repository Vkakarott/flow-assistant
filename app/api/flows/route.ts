import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/auth/options";
import { getSystemFlowCodes, getUserFlowCodes } from "../../../src/server/flow";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userIdentifier = session?.user?.email ?? session?.user?.name ?? "";

  const [systemFlowCodes, userFlowCodes] = await Promise.all([
    getSystemFlowCodes(),
    getUserFlowCodes(userIdentifier)
  ]);

  return NextResponse.json({
    systemFlowCodes,
    userFlowCodes
  });
}
