import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";

const schema = z.object({ scholarshipId: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const session = await requireRole(["STUDENT"]);
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const scholarship = await prisma.scholarship.findUnique({
      where: { id: parsed.data.scholarshipId },
      select: { id: true, status: true },
    });

    if (!scholarship || scholarship.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Scholarship not available" },
        { status: 404 },
      );
    }

    const application = await prisma.application.upsert({
      where: {
        studentId_scholarshipId: {
          studentId: session.user.id,
          scholarshipId: parsed.data.scholarshipId,
        },
      },
      create: {
        studentId: session.user.id,
        scholarshipId: parsed.data.scholarshipId,
        status: "DRAFT",
        currentStep: 1,
        stepData: {},
      },
      update: {},
      include: {
        documents: {
          select: { id: true, filename: true, mimeType: true, kind: true },
        },
      },
    });

    return NextResponse.json({ application });
  } catch (err) {
    return jsonError(err);
  }
}
