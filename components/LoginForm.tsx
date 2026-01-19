"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/dashboard",
          });

          if (res?.error) setError("Invalid email or password");
        });
      }}
    >
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <button
        disabled={isPending}
        type="submit"
        className="h-12 w-full rounded-2xl bg-black font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        Login
      </button>
    </form>
  );
}
