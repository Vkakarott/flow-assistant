import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../src/auth/options";
import { NewMatrixForm } from "./NewMatrixForm";

export default async function NewMatrixPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/nova-matriz");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8">
      <NewMatrixForm />
    </main>
  );
}
