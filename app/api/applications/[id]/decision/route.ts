import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";
import { sendRejectionEmail, sendAcceptanceEmail } from "@/lib/email";

const schema = z.object({
  decision: z.enum(["ACCEPT", "REJECT"]),
  note: z.string().optional(),
});

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(["ADMIN", "DONOR"]);
    const { id } = await ctx.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { scholarship: { select: { donorId: true } } },
    });

    if (!application)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (session.user.role === "DONOR" && session.user.id !== application.scholarship.donorId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const newStatus = parsed.data.decision === "ACCEPT" ? "ACCEPTED" : "REJECTED";

    const updated = await prisma.application.update({
      where: { id },
      data: { 
        status: newStatus,
        rejectionNote: parsed.data.decision === "REJECT" ? (parsed.data.note ?? null) : null,
        acceptanceNote: parsed.data.decision === "ACCEPT" ? (parsed.data.note ?? null) : null,
      },
      select: { id: true, status: true },
    });

    // If rejected, attempt to send a notification email to the student
    if (parsed.data.decision === "REJECT") {
      try {
        const appWithStudent = await prisma.application.findUnique({
          where: { id },
          include: { student: { select: { email: true, name: true } } },
        });
        if (appWithStudent?.student?.email) {
          await sendRejectionEmail({
            to: appWithStudent.student.email,
            fullName: appWithStudent.student.name ?? null,
            reason: parsed.data.note ?? null,
          });
        }
      } catch (err) {
        // do not fail the request if email sending fails
        console.error("Failed to send rejection email", err);
      }
    }

    // If accepted, send acceptance/shortlist email to the student
    if (parsed.data.decision === "ACCEPT") {
      try {
        const appWithDetails = await prisma.application.findUnique({
          where: { id },
          include: { 
            student: { select: { email: true, name: true } },
            scholarship: { select: { title: true } },
          },
        });
        if (appWithDetails?.student?.email) {
          await sendAcceptanceEmail({
            to: appWithDetails.student.email,
            fullName: appWithDetails.student.name ?? null,
            nextSteps: parsed.data.note ?? null,
            scholarshipTitle: appWithDetails.scholarship.title ?? null,
          });
        }
      } catch (err) {
        // do not fail the request if email sending fails
        console.error("Failed to send acceptance email", err);
      }
    }

    return NextResponse.json({ application: updated });
  } catch (err) {
    return jsonError(err);
  }
}
