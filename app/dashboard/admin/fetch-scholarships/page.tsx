"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FetchScholarshipsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"scanning" | "success" | "error">("scanning");
  const [scholarshipsAdded, setScholarshipsAdded] = useState(0);
  const [message, setMessage] = useState("Scanning for scholarships...");
  const [currentScholarship, setCurrentScholarship] = useState("");

  useEffect(() => {
    let offset = 0;
    let totalAdded = 0;

    const scholarshipNames = [
      "Commonwealth Scholarship",
      "Chevening Scholarships",
      "Fulbright Program",
      "DAAD Scholarships",
      "Erasmus Mundus",
    ];

    async function fetchBatch() {
      try {
        // Show current scholarship being fetched
        if (offset < scholarshipNames.length) {
          setCurrentScholarship(scholarshipNames[offset]);
        }

        const res = await fetch("/api/admin/scholarships/fetch", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ offset }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch scholarships");
        }

        const data = await res.json();
        totalAdded += data.addedCount;
        setScholarshipsAdded(totalAdded);

        if (data.hasMore && totalAdded < 5) {
          offset = data.nextOffset;
          // Wait a bit before next batch for animation
          setTimeout(() => fetchBatch(), 1500);
        } else {
          // Done
          setStatus("success");
          setMessage(
            totalAdded > 0
              ? `Successfully added ${totalAdded} scholarship${totalAdded !== 1 ? "s" : ""}!`
              : "All scholarships are already in the database."
          );
          setTimeout(() => {
            router.push("/dashboard/admin");
          }, 3000);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Failed to fetch scholarships");
      }
    }

    fetchBatch();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-blue-900">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-blue-700 to-blue-900 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8H9L12 2Z" fill="currentColor" opacity="0.9" />
                <path d="M12 22L9 16H15L12 22Z" fill="currentColor" opacity="0.7" />
                <path d="M2 12L8 15V9L2 12Z" fill="currentColor" opacity="0.6" />
                <path d="M22 12L16 9V15L22 12Z" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GamScholar</h1>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {/* Scanning Animation */}
          <div className="relative h-48 w-48">
            {/* Outer circle */}
            <div
              className={`absolute inset-0 rounded-full border-4 ${
                status === "scanning"
                  ? "border-blue-200 dark:border-blue-800"
                  : status === "success"
                  ? "border-green-200 dark:border-green-800"
                  : "border-red-200 dark:border-red-800"
              }`}
            />

            {/* Animated scanning circle */}
            {status === "scanning" && (
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400" />
            )}

            {/* Inner content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {status === "scanning" && (
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    {scholarshipsAdded}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Found
                  </div>
                </div>
              )}

              {status === "success" && (
                <svg
                  className="h-20 w-20 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}

              {status === "error" && (
                <svg
                  className="h-20 w-20 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            {/* Pulse effect */}
            {status === "scanning" && (
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20" />
            )}
          </div>

          {/* Status message */}
          <div className="text-center">
            <h2
              className={`text-xl font-semibold ${
                status === "scanning"
                  ? "text-gray-900 dark:text-white"
                  : status === "success"
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {message}
            </h2>

            {status === "scanning" && currentScholarship && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Checking: {currentScholarship}
              </p>
            )}

            {status === "success" && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Redirecting to dashboard...
              </p>
            )}

            {status === "error" && (
              <Link
                href="/dashboard/admin"
                className="mt-4 inline-block rounded-2xl bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              >
                Back to Dashboard
              </Link>
            )}
          </div>

          {/* Progress dots */}
          {status === "scanning" && (
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i < scholarshipsAdded
                      ? "bg-blue-600 dark:bg-blue-400"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
