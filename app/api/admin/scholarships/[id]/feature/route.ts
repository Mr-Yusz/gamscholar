import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";

const schema = z.object({ featured: z.boolean() });

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await ctx.params;

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await prisma.scholarship.update({
      where: { id },
      data: { featured: parsed.data.featured },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
