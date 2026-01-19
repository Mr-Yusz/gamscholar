import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Welcome back.
      </p>
      <LoginForm />

      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        New here?{" "}
        <Link href="/auth/signup" className="font-medium hover:underline">
          Create an account
        </Link>
        .
      </p>
    </div>
  );
}
