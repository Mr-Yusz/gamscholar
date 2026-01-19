import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(["DONOR", "ADMIN"]);
    const { id } = await ctx.params;

    const existing = await prisma.scholarship.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (session.user.role !== "ADMIN" && existing.donorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.scholarship.update({
      where: { id },
      data: { status: "UNPUBLISHED" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
