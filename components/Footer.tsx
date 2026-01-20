"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer mt-12">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-blue-700 to-blue-900 text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15 8H9L12 2Z" fill="currentColor" opacity="0.9" />
                    <path d="M12 22L9 16H15L12 22Z" fill="currentColor" opacity="0.7" />
                    <path d="M2 12L8 15V9L2 12Z" fill="currentColor" opacity="0.6" />
                    <path d="M22 12L16 9V15L22 12Z" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold text-zinc-900 dark:text-white">GamScholar</div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Connecting students with scholarship opportunities.</div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <a className="social-icon" href="https://twitter.com" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" fill="currentColor"/></svg>
              </a>
              <a className="social-icon" href="https://linkedin.com" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5a2.5 2.5 0 11.02 0zM3 8.98h4v12H3zM9 8.98h3.75v1.6h.05c.52-.98 1.8-2.02 3.7-2.02 3.95 0 4.68 2.6 4.68 5.98V21h-4v-5.02c0-1.2 0-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.64V21H9z" fill="currentColor"/></svg>
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Quick links</div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/scholarships" className="hover:underline">Scholarships</a></li>
              <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Join our newsletter</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Get curated scholarship alerts and application tips.</p>

            <form className="mt-4 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                aria-label="Email"
                placeholder="Your email"
                className="flex-1 rounded-md bg-white/6 px-3 py-2 text-sm text-white placeholder-white/70 focus:outline-none"
              />
              <button className="btn-primary" type="submit">Subscribe</button>
            </form>

            <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Support: <a href="mailto:yj22011025@utg.edu.gm" className="font-medium hover:underline">yj22011025@utg.edu.gm</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <div className="mb-1">© {new Date().getFullYear()} GamScholar. All rights reserved.</div>
          <div className="space-x-3">
            <a href="/terms" className="text-xs hover:underline">Terms</a>
            <a href="/privacy" className="text-xs hover:underline">Privacy</a>
            <a href="/contact" className="text-xs hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
