import Link from "next/link";
import { redirect } from "next/navigation";

import SignupForm from "@/components/SignupForm";
import { getSession } from "@/lib/session";

export default async function SignupPage() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Create a student or donor account.
      </p>
      <SignupForm />

      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium hover:underline">
          Login
        </Link>
        .
      </p>
    </div>
  );
}
