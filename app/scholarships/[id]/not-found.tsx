import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-black">
      <h1 className="text-xl font-semibold">Scholarship not found</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        It may be unpublished, restricted, or removed.
      </p>
      <Link
        href="/scholarships"
        className="mt-6 inline-block rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        Back to scholarships
      </Link>
    </div>
  );
}
