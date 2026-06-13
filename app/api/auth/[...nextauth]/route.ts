import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import {
  clearLoginAttempts,
  getLoginLock,
  registerFailedLogin,
  validateUserPassword,
} from "@/lib/auth-store";

export const runtime = "nodejs";

const getEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
};

const googleClientId = getEnv("GOOGLE_CLIENT_ID");
const googleClientSecret = getEnv("GOOGLE_CLIENT_SECRET");
const githubClientId = getEnv("GITHUB_ID", "GITHUB_CLIENT_ID");
const githubClientSecret = getEnv("GITHUB_SECRET", "GITHUB_CLIENT_SECRET");
const discordClientId = getEnv("DISCORD_ID", "DISCORD_CLIENT_ID");
const discordClientSecret = getEnv("DISCORD_SECRET_CLIENT");

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signIn",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        const lockedUntil = await getLoginLock(email);

        if (lockedUntil) {
          throw new Error(
            `Cuenta bloqueada hasta ${lockedUntil.toLocaleTimeString("es-PE")}.`,
          );
        }

        const user = await validateUserPassword(email, password);

        if (!user) {
          await registerFailedLogin(email);
          return null;
        }

        await clearLoginAttempts(email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
    ...(githubClientId && githubClientSecret
      ? [
          GitHubProvider({
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          }),
        ]
      : []),
    ...(discordClientId && discordClientSecret
      ? [
          DiscordProvider({
            clientId: discordClientId,
            clientSecret: discordClientSecret,
          }),
        ]
      : []),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
