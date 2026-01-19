import Link from "next/link";

import ScholarshipEditor from "@/components/ScholarshipEditor";

export const dynamic = "force-dynamic";

export default function NewScholarshipPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New scholarship</h1>
        <Link
          href="/dashboard/donor"
          className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          Back →
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
        <ScholarshipEditor />
      </div>
    </div>
  );
}
