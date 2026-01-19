import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";

const createSchema = z.object({
  title: z.string().min(3).max(120),
  amountGmd: z.number().int().min(1),
  degree: z.string().min(2).max(80),
  field: z.string().min(2).max(80),
  description: z.string().min(10).max(20000),
  deadline: z.string().datetime().optional().nullable(),
  eligibility: z.array(z.string().min(2).max(200)).max(50).default([]),
  saveAsDraft: z.boolean().default(true),
});

export async function POST(req: Request) {
  try {
    const session = await requireRole(["DONOR", "ADMIN"]);
    const body = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const status = data.saveAsDraft ? "DRAFT" : "PENDING_REVIEW";

    const scholarship = await prisma.scholarship.create({
      data: {
        donorId: session.user.id,
        title: data.title,
        amountGmd: data.amountGmd,
        degree: data.degree,
        field: data.field,
        description: data.description,
        deadline: data.deadline ? new Date(data.deadline) : null,
        status,
        eligibility: {
          create: data.eligibility
            .map((text) => text.trim())
            .filter(Boolean)
            .map((text, idx) => ({ text, order: idx + 1 })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ scholarship }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
