import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function TrackApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user) return null;

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      scholarship: {
        select: {
          id: true,
          title: true,
          degree: true,
          field: true,
          amountGmd: true,
        },
      },
    },
  });

  if (!application) {
    return notFound();
  }

  // Only the student who owns this application can view it
  if (application.studentId !== session.user.id) {
    return notFound();
  }

  const statusColor = {
    DRAFT: "text-zinc-600 dark:text-zinc-400",
    SUBMITTED: "text-blue-600 dark:text-blue-400",
    UNDER_REVIEW: "text-yellow-600 dark:text-yellow-400",
    ACCEPTED: "text-green-600 dark:text-green-400",
    REJECTED: "text-red-600 dark:text-red-400",
    WITHDRAWN: "text-gray-600 dark:text-gray-400",
  };

  const statusBg = {
    DRAFT: "bg-zinc-100 dark:bg-zinc-800",
    SUBMITTED: "bg-blue-100 dark:bg-blue-900/30",
    UNDER_REVIEW: "bg-yellow-100 dark:bg-yellow-900/30",
    ACCEPTED: "bg-green-100 dark:bg-green-900/30",
    REJECTED: "bg-red-100 dark:bg-red-900/30",
    WITHDRAWN: "bg-gray-100 dark:bg-gray-800",
  };

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/dashboard/student"
          className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Track Application</h1>
      </header>

      <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h2 className="text-lg font-semibold">
          {application.scholarship.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {application.scholarship.degree} • {application.scholarship.field} •{" "}
          GMD {application.scholarship.amountGmd.toLocaleString()}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Application Status
            </label>
            <div
              className={`mt-2 inline-block rounded-2xl px-4 py-2 text-base font-semibold ${statusBg[application.status]} ${statusColor[application.status]}`}
            >
              {application.status}
            </div>
          </div>

          {application.status === "REJECTED" && application.rejectionNote && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                Reason for Rejection
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700 dark:text-red-300">
                {application.rejectionNote}
              </p>
            </div>
          )}

          {application.status === "REJECTED" && !application.rejectionNote && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-300">
                Your application was not shortlisted. No specific reason was
                provided.
              </p>
            </div>
          )}

          {application.status === "ACCEPTED" && application.acceptanceNote && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                🎉 Congratulations! Next Steps
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-green-700 dark:text-green-300">
                {application.acceptanceNote}
              </p>
            </div>
          )}

          {application.status === "ACCEPTED" && !application.acceptanceNote && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                🎉 Congratulations!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your application has been shortlisted! The donor will contact you with next steps.
              </p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-black/10 pt-4 dark:border-white/10">
            <div>
              <label className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-500">
                Submitted
              </label>
              <p className="mt-1 text-sm">
                {application.submittedAt
                  ? new Date(application.submittedAt).toLocaleDateString()
                  : "Not submitted"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-500">
                Last Updated
              </label>
              <p className="mt-1 text-sm">
                {new Date(application.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/scholarships/${application.scholarship.id}`}
              className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            >
              View Scholarship
            </Link>
            {application.status === "DRAFT" && (
              <Link
                href={`/scholarships/${application.scholarship.id}/apply`}
                className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Continue Application
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
