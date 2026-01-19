import Link from "next/link";

import { getSession } from "@/lib/session";

export default async function SiteHeader() {
  const session = await getSession();
  const role = session?.user?.role;

  return (
    <header className="border-b border-black/10 bg-white/70 backdrop-blur dark:bg-black/50 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            GamScholar
          </Link>
          <nav className="hidden gap-4 text-sm text-zinc-600 sm:flex dark:text-zinc-300">
            <Link
              href="/scholarships"
              className="hover:text-black dark:hover:text-white"
            >
              Scholarships
            </Link>
            <Link
              href="/about"
              className="hover:text-black dark:hover:text-white"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-black/10 px-4 py-2 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              >
                Dashboard{role ? ` (${role.toLowerCase()})` : ""}
              </Link>
              <Link
                href="/logout"
                className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-black/10 px-4 py-2 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
