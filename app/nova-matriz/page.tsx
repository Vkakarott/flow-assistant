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
    <main className="theme-bg min-h-screen px-4 py-8">
      <NewMatrixForm />
    </main>
  );
}
