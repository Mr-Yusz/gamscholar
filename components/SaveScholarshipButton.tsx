"use client";

import { useState, useTransition } from "react";

export default function SaveScholarshipButton({
  scholarshipId,
  initialSaved,
}: {
  scholarshipId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await fetch(`/api/scholarships/${scholarshipId}/save`, {
            method: saved ? "DELETE" : "POST",
          });
          if (!res.ok) return;
          setSaved(!saved);
        });
      }}
      className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
