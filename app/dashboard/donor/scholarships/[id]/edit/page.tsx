import Link from "next/link";
import { notFound } from "next/navigation";

import ScholarshipEditor from "@/components/ScholarshipEditor";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EditScholarshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user) return null;

  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
    include: { eligibility: { orderBy: { order: "asc" } } },
  });

  if (!scholarship) notFound();
  if (session.user.role !== "ADMIN" && scholarship.donorId !== session.user.id)
    notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit scholarship</h1>
        <Link
          href="/dashboard/donor"
          className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          Back →
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
        <ScholarshipEditor
          initial={{
            id: scholarship.id,
            title: scholarship.title,
            amountGmd: scholarship.amountGmd,
            degree: scholarship.degree,
            field: scholarship.field,
            description: scholarship.description,
            deadline: scholarship.deadline
              ? scholarship.deadline.toISOString().slice(0, 10)
              : "",
            eligibility: scholarship.eligibility.map((e) => e.text),
          }}
        />
      </div>
    </div>
  );
}
