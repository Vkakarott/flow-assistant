import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "./password";

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
      name: "Email e senha",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!process.env.DATABASE_URL) {
          return null;
        }

        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        if (!email.includes("@")) {
          return null;
        }

        const existingUser = await prisma.authUser.findUnique({
          where: { email }
        });

        if (!existingUser) {
          const createdUser = await prisma.authUser.create({
            data: {
              email,
              passwordHash: hashPassword(password)
            }
          });

          return {
            id: createdUser.id,
            name: email.split("@")[0],
            email: createdUser.email
          };
        }

        if (!verifyPassword(password, existingUser.passwordHash)) {
          return null;
        }

        return {
          id: existingUser.id,
          name: existingUser.email.split("@")[0],
          email: existingUser.email
        };
      }
    })
  ]
};
