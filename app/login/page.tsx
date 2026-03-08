import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../src/auth/options";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main className="theme-bg min-h-screen flex items-center justify-center px-4">
      <LoginForm />
    </main>
  );
}
