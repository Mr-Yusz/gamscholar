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
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {session?.user && isStudent ? (
              <SaveScholarshipButton
                scholarshipId={scholarship.id}
                initialSaved={initialSaved}
              />
            ) : null}

            {isStudent && session?.user ? (
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
            ) : (
              <Link
                href="/auth/login"
                className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Login to apply
              </Link>
            )}
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
