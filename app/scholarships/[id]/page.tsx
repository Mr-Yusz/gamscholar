import Link from "next/link";
import { notFound } from "next/navigation";

import SaveScholarshipButton from "@/components/SaveScholarshipButton";
import { formatDate, formatGmd } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ScholarshipDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
    include: {
      donor: { select: { id: true, name: true, email: true } },
      eligibility: { orderBy: { order: "asc" } },
    },
  });

  if (!scholarship) notFound();

  const role = session?.user?.role;
  const canSeeUnpublished =
    role === "ADMIN" ||
    (role === "DONOR" && session?.user?.id === scholarship.donorId);

  if (scholarship.status !== "PUBLISHED" && !canSeeUnpublished) {
    notFound();
  }

  const isStudent = role === "STUDENT";
  const canApply = isStudent && scholarship.status === "PUBLISHED";
  let existingApplication: { id: string; status: string } | null = null;
  if (isStudent && session?.user?.id) {
    existingApplication = await prisma.application.findUnique({
      where: {
        studentId_scholarshipId: {
          studentId: session.user.id,
          scholarshipId: scholarship.id,
        },
      },
      select: { id: true, status: true },
    });
  }

  const initialSaved =
    isStudent && session?.user?.id
      ? !!(await prisma.scholarshipSave.findUnique({
          where: {
            studentId_scholarshipId: {
              studentId: session.user.id,
              scholarshipId: scholarship.id,
            },
          },
        }))
      : false;

  return (
    <div className="space-y-6">
      {scholarship.isExternal && (
        <div className="rounded-3xl border-2 border-red-500 bg-red-50 p-6 dark:border-red-700 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-100">
                ⚠️ EXTERNAL SCHOLARSHIP - NOT AFFILIATED WITH GAMSCHOLAR
              </h3>
              <p className="mt-2 text-sm text-red-800 dark:text-red-200">
                This scholarship is listed for informational purposes only. GamScholar is NOT affiliated with this scholarship program and does NOT process applications for it. You must apply directly through the scholarship provider's official website.
              </p>
              {scholarship.externalApplicationUrl && (
                <a
                  href={scholarship.externalApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  Apply on Official Website
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {scholarship.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Sponsored by {scholarship.donor.name ?? scholarship.donor.email}
              {canSeeUnpublished ? (
                <>
                  {" "}
                  <span className="ml-2 rounded-full bg-black/5 px-3 py-1 text-xs font-medium dark:bg-white/10">
                    {scholarship.status}
                  </span>
                </>
              ) : null}
              {scholarship.isExternal && (
                <span className="ml-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800 dark:bg-red-900/30 dark:text-red-200">
                  EXTERNAL
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!scholarship.isExternal && session?.user && isStudent ? (
              <SaveScholarshipButton
                scholarshipId={scholarship.id}
                initialSaved={initialSaved}
              />
            ) : null}

            {!scholarship.isExternal && isStudent && session?.user ? (
              existingApplication ? (
                // If application is a draft, let student continue; otherwise let them track
                existingApplication.status === "DRAFT" ? (
                  <Link
                    href={`/scholarships/${scholarship.id}/apply`}
                    className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                  >
                    Continue application
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/student"
                    className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                  >
                    Track application
                  </Link>
                )
              ) : canApply ? (
                <Link
                  href={`/scholarships/${scholarship.id}/apply`}
                  className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                >
                  Apply
                </Link>
              ) : (
                <span className="rounded-2xl bg-black/5 px-4 py-2 text-sm text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                  Applications available for students
                </span>
              )
            ) : scholarship.isExternal && scholarship.externalApplicationUrl ? (
              <a
                href={scholarship.externalApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Apply Externally →
              </a>
            ) : !scholarship.isExternal ? (
              <Link
                href="/auth/login"
                className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Login to apply
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Amount" value={formatGmd(scholarship.amountGmd)} />
          <Info
            label="Deadline"
            value={
              scholarship.deadline
                ? formatDate(scholarship.deadline)
                : "Not specified"
            }
          />
          <Info label="Degree" value={scholarship.degree} />
          <Info label="Field" value={scholarship.field} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            {scholarship.description}
          </p>
        </section>

        <aside className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
          <h2 className="text-lg font-semibold">Eligibility criteria</h2>
          {scholarship.eligibility.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Not specified.
            </p>
          ) : (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              {scholarship.eligibility.map((e) => (
                <li key={e.id}>{e.text}</li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
      <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
