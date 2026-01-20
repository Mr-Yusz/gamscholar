import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("🔐 NextAuth Route Handler Initialized");
console.log("Environment:", process.env.NODE_ENV);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const handler = NextAuth(authOptions);
console.log("✅ NextAuth handler created successfully");

export { handler as GET, handler as POST };
