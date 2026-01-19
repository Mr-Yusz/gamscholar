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

    const application = await prisma.application.findUnique({
      where: { id },
      include: { scholarship: { select: { status: true } } },
    });

    if (!application)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (application.studentId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (application.status !== "DRAFT") {
      return NextResponse.json({ error: "Already submitted" }, { status: 400 });
    }
    if (application.scholarship.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Scholarship not available" },
        { status: 400 },
      );
    }

    // Minimal validation (we can tighten later)
    const stepData = (application.stepData ?? {}) as any;
    if (!stepData.personal?.fullName || !stepData.personal?.phone) {
      return NextResponse.json(
        { error: "Missing personal info" },
        { status: 400 },
      );
    }
    if (!stepData.academic?.institution || !stepData.academic?.level) {
      return NextResponse.json(
        { error: "Missing academic info" },
        { status: 400 },
      );
    }

    await prisma.application.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        currentStep: 4,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
