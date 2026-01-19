import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-transparent bg-blue-600 p-8 shadow-sm text-white dark:bg-blue-700">
      <h1 className="text-2xl font-semibold text-white">Login</h1>
      <p className="mt-2 text-sm text-white/90">Welcome back.</p>
      <LoginForm />

      <p className="mt-6 text-sm text-white/90">
        New here?{" "}
        <Link href="/auth/signup" className="font-medium underline-offset-2 hover:underline text-white">
          Create an account
        </Link>
        .
      </p>
    </div>
  );
}
