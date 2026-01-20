import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const scholarships = await prisma.scholarship.findMany({
    include: { donor: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return <AdminDashboardClient scholarships={scholarships} />;
}

