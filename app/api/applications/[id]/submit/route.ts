import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";
import { sendSubmissionEmail } from "@/lib/email";

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

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        currentStep: 4,
      },
      include: { scholarship: { select: { id: true, title: true, donorId: true } }, student: { select: { id: true, name: true, email: true } } },
    });

    // notify donor (if present)
    try {
      const donorId = updated.scholarship?.donorId;
      if (donorId) {
        const donor = await prisma.user.findUnique({ where: { id: donorId }, select: { email: true, name: true } });
        if (donor?.email) {
          await sendSubmissionEmail({
            to: donor.email,
            studentName: updated.student?.name ?? null,
            scholarshipId: updated.scholarship?.id ?? null,
            scholarshipTitle: updated.scholarship?.title ?? null,
          });
        }
      }
    } catch (err) {
      console.error("Failed to send submission email to donor", err);
    }

    return NextResponse.json({ ok: true, application: { id } });
  } catch (err) {
    return jsonError(err);
  }
}
