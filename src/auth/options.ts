import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const AUTH_USERNAME = process.env.AUTH_USERNAME ?? "admin";
const AUTH_PASSWORD = process.env.AUTH_PASSWORD ?? "admin123";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me",
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "");
        const password = String(credentials?.password ?? "");

        if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
          return null;
        }

        return {
          id: "1",
          name: "Administrador",
          email: "admin@flow.local"
        };
      }
    })
  ]
};
