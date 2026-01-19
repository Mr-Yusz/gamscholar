import Link from "next/link";

import ScholarshipRowActions from "@/components/ScholarshipRowActions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const scholarships = await prisma.scholarship.findMany({
    include: { donor: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Moderate scholarships (publish, unpublish, restrict, delete).
        </p>
      </header>

      {scholarships.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
          No scholarships yet.
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
                    Donor: {s.donor.name ?? s.donor.email} • Status:{" "}
                    <span className="font-medium">{s.status}</span>
                    {s.featured ? " • Featured" : ""}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/scholarships/${s.id}`}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      View
                    </Link>
                  </div>
                </div>

                <ScholarshipRowActions
                  scholarshipId={s.id}
                  mode="admin"
                  featured={s.featured}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
