import Link from "next/link";

import ScholarshipCard from "@/components/ScholarshipCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();

  const scholarships = await prisma.scholarship.findMany({
    where: {
      status: "PUBLISHED",
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { degree: { contains: q, mode: "insensitive" } },
              { field: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { donor: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
    take: 60,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Scholarships</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {q ? (
              <>
                Showing results for <span className="font-medium">“{q}”</span> (
                {scholarships.length})
              </>
            ) : (
              <>Browse published scholarships ({scholarships.length})</>
            )}
          </p>
        </div>

        <form action="/scholarships" method="GET" className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search…"
            className="h-11 w-full rounded-2xl border border-black/10 bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20 sm:w-80"
          />
          <button
            className="h-11 rounded-2xl bg-black px-5 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      {scholarships.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
          No scholarships found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} />
          ))}
        </div>
      )}

      <div className="pt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Want to create scholarships?{" "}
        <Link href="/auth/signup" className="font-medium hover:underline">
          Sign up as a donor
        </Link>
        .
      </div>
    </div>
  );
}
