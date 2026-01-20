import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Log environment check on module load
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not defined!");
}
if (!process.env.NEXTAUTH_URL) {
  console.error("❌ NEXTAUTH_URL is not defined!");
}
console.log("✅ NextAuth Config Loaded - URL:", process.env.NEXTAUTH_URL);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        try {
          console.log("🔑 Authorize attempt");
          const parsed = credentialsSchema.safeParse(raw);
          if (!parsed.success) {
            console.log("❌ Schema validation failed");
            return null;
          }

          const { email, password } = parsed.data;
          console.log("🔍 Looking up user:", email);
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          console.log("✅ User found, verifying password");
          const ok = await verifyPassword(password, user.passwordHash);
          if (!ok) {
            console.log("❌ Password verification failed");
            return null;
          }

          console.log("✅ Authorization successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
          } as any;
        } catch (error) {
          console.error("❌ Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
