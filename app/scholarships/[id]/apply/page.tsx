import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import ApplicationWizard from "@/components/ApplicationWizard";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
    select: { id: true, title: true, status: true, isExternal: true },
  });

  if (!scholarship || scholarship.status !== "PUBLISHED") notFound();

  // Block applications for external scholarships
  if (scholarship.isExternal) {
    redirect(`/scholarships/${id}`);
  }

  const application = await prisma.application.upsert({
    where: {
      studentId_scholarshipId: {
        studentId: session.user.id,
        scholarshipId: id,
      },
    },
    create: {
      studentId: session.user.id,
      scholarshipId: id,
      status: "DRAFT",
      currentStep: 1,
      stepData: {},
    },
    update: {},
    include: {
      documents: {
        select: { id: true, filename: true, mimeType: true, kind: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Apply</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {scholarship.title}
          </p>
        </div>
        <Link
          href={`/scholarships/${id}`}
          className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          Back to scholarship →
        </Link>
      </div>

      <ApplicationWizard scholarshipId={id} application={application as any} />
    </div>
  );
}
