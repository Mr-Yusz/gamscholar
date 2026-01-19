import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

const signupSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z.enum(["STUDENT", "DONOR"]),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      name: name?.trim() || null,
      role,
      passwordHash,
    },
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
