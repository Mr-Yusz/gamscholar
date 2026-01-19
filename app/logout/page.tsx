"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    void signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-black">
      <h1 className="text-xl font-semibold">Logging you out…</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Please wait.
      </p>
    </div>
  );
}
