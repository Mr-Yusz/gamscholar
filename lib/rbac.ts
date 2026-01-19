import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

export async function requireRole(roles: Array<"STUDENT" | "DONOR" | "ADMIN">) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export function jsonError(err: unknown) {
  const message = err instanceof Error ? err.message : "UNKNOWN";
  if (message === "UNAUTHENTICATED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (message === "FORBIDDEN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
