"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ScholarshipRowActions from "@/components/ScholarshipRowActions";

interface Scholarship {
  id: string;
  title: string;
  status: string;
  featured: boolean;
  isExternal: boolean;
  donor: {
    name: string | null;
    email: string;
  };
}

export default function AdminDashboardClient({ scholarships: initialScholarships }: { scholarships: Scholarship[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  function handleFetchScholarships() {
    setMessage({
      text: "Starting scholarship search...",
      type: "info",
    });

    // Navigate to the fetch page
    setTimeout(() => {
      router.push("/dashboard/admin/fetch-scholarships");
    }, 500);
  }

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Moderate scholarships (publish, unpublish, restrict, delete).
          </p>
        </div>
        <button
          onClick={handleFetchScholarships}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800"
        >
          Fetch External Scholarships
        </button>
      </header>

      {message && (
        <div
          className={`rounded-2xl border p-4 ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200"
              : message.type === "error"
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
              : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {initialScholarships.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
          No scholarships yet.
        </div>
      ) : (
        <div className="space-y-3">
          {initialScholarships.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-base font-semibold">{s.title}</div>
                    {s.isExternal && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                        External
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Donor: {s.donor.name ?? s.donor.email} • Status:{" "}
                    <span className="font-medium">{s.status}</span>
                    {s.featured ? " • Featured" : ""}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/scholarships/${s.id}`}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      View
                    </Link>
                  </div>
                </div>

                <ScholarshipRowActions
                  scholarshipId={s.id}
                  mode="admin"
                  featured={s.featured}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
