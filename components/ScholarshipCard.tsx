import Link from "next/link";

import { formatDate, formatGmd } from "@/lib/format";

type ScholarshipCardProps = {
  scholarship: {
    id: string;
    title: string;
    amountGmd: number;
    degree: string;
    field: string;
    deadline: Date | null;
    donor: { name: string | null; email: string };
  };
};

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold leading-6">
          {scholarship.title}
        </h3>
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
          {formatGmd(scholarship.amountGmd)}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
        <div>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Donor:
          </span>{" "}
          {scholarship.donor.name ?? scholarship.donor.email}
        </div>
        <div>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Degree:
          </span>{" "}
          {scholarship.degree}
        </div>
        <div>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Field:
          </span>{" "}
          {scholarship.field}
        </div>
        <div>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Deadline:
          </span>{" "}
          {scholarship.deadline
            ? formatDate(scholarship.deadline)
            : "Not specified"}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Link
          href={`/scholarships/${scholarship.id}`}
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          View more
        </Link>
        <Link
          href={`/scholarships/${scholarship.id}`}
          className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          Details →
        </Link>
      </div>
    </div>
  );
}
