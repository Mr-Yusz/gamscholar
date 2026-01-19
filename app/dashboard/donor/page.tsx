import Link from "next/link";

import ScholarshipRowActions from "@/components/ScholarshipRowActions";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DonorDashboard() {
  const session = await getSession();
  if (!session?.user) return null;

  const donorId = session.user.id;

  const scholarships = await prisma.scholarship.findMany({
    where: { donorId },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Donor dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Create and manage scholarships. Publishing requires admin approval.
          </p>
        </div>

        <Link
          href="/dashboard/donor/scholarships/new"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-black px-5 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          New scholarship
        </Link>
      </header>

      {scholarships.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
          You haven't created any scholarships yet.
        </div>
      ) : (
        <div className="space-y-3">
          {scholarships.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-base font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Status: <span className="font-medium">{s.status}</span> •
                    Applicants: {s._count.applications}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/scholarships/${s.id}`}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/donor/scholarships/${s.id}/edit`}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/donor/scholarships/${s.id}/applicants`}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      Applicants
                    </Link>
                  </div>
                </div>

                <ScholarshipRowActions scholarshipId={s.id} mode="donor" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
