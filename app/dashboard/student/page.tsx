import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session?.user) return null;

  const studentId = session.user.id;

  const [saved, applications] = await Promise.all([
    prisma.scholarshipSave.findMany({
      where: { studentId },
      include: {
        scholarship: {
          include: { donor: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.application.findMany({
      where: { studentId },
      include: {
        scholarship: {
          include: { donor: { select: { name: true, email: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold">Student dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Saved scholarships, applications, and statuses.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Saved scholarships</h2>
        {saved.length === 0 ? (
          <Empty
            label="No saved scholarships yet."
            ctaHref="/scholarships"
            cta="Browse scholarships"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black"
              >
                <div className="text-base font-semibold">
                  {row.scholarship.title}
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {row.scholarship.degree} • {row.scholarship.field}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/scholarships/${row.scholarshipId}`}
                    className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                  >
                    View
                  </Link>
                  <Link
                    href={`/scholarships/${row.scholarshipId}/apply`}
                    className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your applications</h2>
        {applications.length === 0 ? (
          <Empty
            label="No applications yet."
            ctaHref="/scholarships"
            cta="Find scholarships"
          />
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-base font-semibold">
                      {app.scholarship.title}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Status: <span className="font-medium">{app.status}</span>{" "}
                      • Step {app.currentStep}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/scholarships/${app.scholarshipId}`}
                      className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      View scholarship
                    </Link>
                    {app.status === "DRAFT" ? (
                      <Link
                        href={`/scholarships/${app.scholarshipId}/apply`}
                        className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                      >
                        Continue
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Empty({
  label,
  cta,
  ctaHref,
}: {
  label: string;
  cta: string;
  ctaHref: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
      <div>{label}</div>
      <Link
        href={ctaHref}
        className="mt-3 inline-block font-medium text-black hover:underline dark:text-white"
      >
        {cta} →
      </Link>
    </div>
  );
}
