import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("🔐 NextAuth Route Handler Initialized");
console.log("Environment:", process.env.NODE_ENV);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
