import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(["STUDENT"]);
    const { id } = await ctx.params;

    await prisma.scholarshipSave.upsert({
      where: {
        studentId_scholarshipId: {
          studentId: session.user.id,
          scholarshipId: id,
        },
      },
      create: {
        studentId: session.user.id,
        scholarshipId: id,
      },
      update: {},
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(["STUDENT"]);
    const { id } = await ctx.params;

    await prisma.scholarshipSave.delete({
      where: {
        studentId_scholarshipId: {
          studentId: session.user.id,
          scholarshipId: id,
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // deleting a non-existent save should be idempotent
    return NextResponse.json({ ok: true });
  }
}
