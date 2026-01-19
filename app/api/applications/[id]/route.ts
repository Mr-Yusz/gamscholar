import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";

const patchSchema = z.object({
  currentStep: z.number().int().min(1).max(4).optional(),
  stepData: z.record(z.string(), z.any()).optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(["STUDENT"]);
    const { id } = await ctx.params;

    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.studentId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (existing.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Cannot edit submitted application" },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const nextStepData = {
      ...(existing.stepData as any),
      ...(parsed.data.stepData ?? {}),
    };

    const updated = await prisma.application.update({
      where: { id },
      data: {
        currentStep: parsed.data.currentStep ?? existing.currentStep,
        stepData: nextStepData,
      },
      select: { id: true, currentStep: true, stepData: true },
    });

    return NextResponse.json({ application: updated });
  } catch (err) {
    return jsonError(err);
  }
}
