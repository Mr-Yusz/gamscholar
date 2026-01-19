import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { jsonError, requireRole } from "@/lib/rbac";

const schema = z.object({
  filename: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(200),
  kind: z.enum(["PDF", "IMAGE", "OTHER"]).default("OTHER"),
  base64: z.string().min(1),
});

const MAX_BASE64_CHARS = 2_000_000; // ~1.5MB binary-ish, keeps Neon rows sane

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(["STUDENT"]);
    const { id } = await ctx.params;

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (application.studentId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (application.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Cannot edit submitted application" },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (parsed.data.base64.length > MAX_BASE64_CHARS) {
      return NextResponse.json(
        { error: "File too large for base64 storage (demo limit)" },
        { status: 413 },
      );
    }

    const doc = await prisma.applicationDocument.create({
      data: {
        applicationId: id,
        filename: parsed.data.filename,
        mimeType: parsed.data.mimeType,
        kind: parsed.data.kind,
        base64: parsed.data.base64,
      },
      select: { id: true, filename: true, mimeType: true, kind: true },
    });

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
