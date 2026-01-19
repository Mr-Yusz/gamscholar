import Link from "next/link";

import ScholarshipCard from "@/components/ScholarshipCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default function Home() {
  const featured = prisma.scholarship.findMany({
    where: { status: "PUBLISHED", featured: true },
    include: { donor: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
    take: 6,
  });

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Scholarships, made clear.
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Discover verified scholarships for Gambian students studying locally
          or abroad. Donors can create scholarships, students can apply
          step-by-step, and admins keep it trustworthy.
        </p>

        <form
          action="/scholarships"
          method="GET"
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            name="q"
            placeholder="Search by title, degree, or field…"
            className="h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
          />
          <button
            type="submit"
            className="h-12 rounded-2xl bg-black px-6 font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Search
          </button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured scholarships</h2>
          <Link
            href="/scholarships"
            className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            View all →
          </Link>
        </div>

        <FeaturedSection featuredPromise={featured} />
      </section>
    </div>
  );
}

async function FeaturedSection({
  featuredPromise,
}: {
  featuredPromise: ReturnType<typeof prisma.scholarship.findMany>;
}) {
  const featured = await featuredPromise;
  if (featured.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
        No featured scholarships yet.
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((s) => (
        <ScholarshipCard key={s.id} scholarship={s} />
      ))}
    </div>
  );
}
