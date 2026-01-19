import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";

const updateSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  amountGmd: z.number().int().min(1).optional(),
  degree: z.string().min(2).max(80).optional(),
  field: z.string().min(2).max(80).optional(),
  description: z.string().min(10).max(20000).optional(),
  deadline: z.string().datetime().nullable().optional(),
  eligibility: z.array(z.string().min(2).max(200)).max(50).optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(["DONOR", "ADMIN"]);
    const { id } = await ctx.params;

    const existing = await prisma.scholarship.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = existing.donorId === session.user.id;
    if (session.user.role !== "ADMIN" && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    await prisma.$transaction(async (tx) => {
      await tx.scholarship.update({
        where: { id },
        data: {
          title: data.title,
          amountGmd: data.amountGmd,
          degree: data.degree,
          field: data.field,
          description: data.description,
          deadline:
            data.deadline === undefined
              ? undefined
              : data.deadline
                ? new Date(data.deadline)
                : null,
        },
      });

      if (data.eligibility) {
        await tx.scholarshipEligibility.deleteMany({
          where: { scholarshipId: id },
        });
        await tx.scholarshipEligibility.createMany({
          data: data.eligibility
            .map((t) => t.trim())
            .filter(Boolean)
            .map((text, idx) => ({ scholarshipId: id, text, order: idx + 1 })),
        });
      }
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
    const session = await requireRole(["DONOR", "ADMIN"]);
    const { id } = await ctx.params;

    const existing = await prisma.scholarship.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ ok: true });

    const isOwner = existing.donorId === session.user.id;
    if (session.user.role !== "ADMIN" && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.scholarship.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
