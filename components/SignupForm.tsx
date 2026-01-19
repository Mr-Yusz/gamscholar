"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "DONOR">("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            setError(data?.error ?? "Could not create account");
            return;
          }

          await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/dashboard",
          });
        });
      }}
    >
      <div>
        <label className="text-sm font-medium">Name (optional)</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
        />
      </div>

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
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
          Minimum 8 characters.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">Account type</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`h-12 rounded-2xl border px-4 text-sm font-medium ${
              role === "STUDENT"
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("DONOR")}
            className={`h-12 rounded-2xl border px-4 text-sm font-medium ${
              role === "DONOR"
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            }`}
          >
            Donor
          </button>
        </div>
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
        Create account
      </button>
    </form>
  );
}
