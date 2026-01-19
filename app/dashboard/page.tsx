import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardIndex() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/login");

  if (session.user.role === "STUDENT") redirect("/dashboard/student");
  if (session.user.role === "DONOR") redirect("/dashboard/donor");
  if (session.user.role === "ADMIN") redirect("/dashboard/admin");

  redirect("/");
}
