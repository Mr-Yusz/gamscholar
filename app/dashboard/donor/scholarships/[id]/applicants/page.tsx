import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user) return null;

  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
    include: { donor: { select: { id: true } } },
  });
  if (!scholarship) notFound();

  if (session.user.role !== "ADMIN" && scholarship.donorId !== session.user.id)
    notFound();

  const applications = await prisma.application.findMany({
    where: { scholarshipId: id },
    include: {
      student: { select: { name: true, email: true } },
      documents: {
        select: { id: true, filename: true, mimeType: true, kind: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Applicants</h1>
        <Link
          href="/dashboard/donor"
          className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          Back →
        </Link>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
        Scholarship ID: <span className="font-medium">{id}</span>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
          No applications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-base font-semibold">
                    {a.student.name ?? a.student.email}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Status: <span className="font-medium">{a.status}</span>
                    {a.submittedAt
                      ? ` • Submitted: ${a.submittedAt.toISOString().slice(0, 10)}`
                      : ""}
                  </div>
                  <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    Docs: {a.documents.length}
                  </div>
                </div>

                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Application ID: {a.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
