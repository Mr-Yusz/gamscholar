import Link from "next/link";

import { getSession } from "@/lib/session";

export default async function SiteHeader() {
  const session = await getSession();
  const role = session?.user?.role;

  return (
    <header className="border-b border-black/10 bg-blue-800 backdrop-blur dark:bg-blue-900 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            GamScholar
          </Link>
          <nav className="hidden gap-4 text-sm text-white sm:flex">
            <Link href="/scholarships" className="hover:text-blue-200">
              Scholarships
            </Link>
            <Link href="/about" className="hover:text-blue-200">
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/20 px-4 py-2 hover:bg-white/10 text-white"
              >
                Dashboard{role ? ` (${role.toLowerCase()})` : ""}
              </Link>
              <Link
                href="/logout"
                className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-white/20 px-4 py-2 hover:bg-white/10 text-white"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
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
