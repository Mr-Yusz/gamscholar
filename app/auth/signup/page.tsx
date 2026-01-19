import Link from "next/link";
import { redirect } from "next/navigation";

import SignupForm from "@/components/SignupForm";
import { getSession } from "@/lib/session";

export default async function SignupPage() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-transparent bg-blue-500 p-8 shadow-sm text-white dark:bg-blue-700">
      <h1 className="text-2xl font-semibold text-white">Sign up</h1>
      <p className="mt-2 text-sm text-white/90">Create a student or donor account.</p>
      <SignupForm />

      <p className="mt-6 text-sm text-white/90">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium underline-offset-2 hover:underline text-white">
          Login
        </Link>
        .
      </p>
    </div>
  );
}
