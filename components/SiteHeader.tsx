"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SiteHeader() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/scholarships", label: "Scholarships" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 8H9L12 2Z" fill="currentColor" opacity="0.9" />
                  <path d="M12 22L9 16H15L12 22Z" fill="currentColor" opacity="0.7" />
                  <path d="M2 12L8 15V9L2 12Z" fill="currentColor" opacity="0.6" />
                  <path d="M22 12L16 9V15L22 12Z" fill="currentColor" opacity="0.5" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">GamScholar</span>
            </Link>

            <nav className="hidden sm:flex sm:gap-6">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-white/95 hover:text-white hover:underline transition"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  aria-label="Search scholarships"
                  placeholder="Search scholarships..."
                  className="w-64 rounded-md bg-white/10 py-2 pl-10 pr-3 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/25"
                />
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-sm">
              {status === "loading" ? null : session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-full border border-white/20 px-4 py-2 hover:bg-white/10 text-white transition"
                  >
                    Dashboard{role ? ` (${role.toLowerCase()})` : ""}
                  </Link>
                  <Link
                    href="/logout"
                    className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-full border border-white/20 px-4 py-2 hover:bg-white/10 text-white transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setOpen((s) => !s)}
              aria-label="Toggle menu"
              className="sm:hidden inline-flex items-center justify-center rounded-md bg-white/10 p-2 text-white hover:bg-white/20"
            >
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="sm:hidden pb-4">
            <nav className="flex flex-col gap-2 px-1 pt-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block rounded-md px-3 py-2 text-sm text-white hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-2 flex flex-col gap-2 px-1">
              {status === "loading" ? null : session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-md border border-white/10 px-3 py-2 text-sm text-white text-center"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard{role ? ` (${role.toLowerCase()})` : ""}
                  </Link>
                  <Link
                    href="/logout"
                    className="block rounded-md bg-white/10 px-3 py-2 text-sm text-white text-center"
                    onClick={() => setOpen(false)}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block rounded-md border border-white/10 px-3 py-2 text-sm text-white text-center"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block rounded-md bg-white/10 px-3 py-2 text-sm text-white text-center"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
