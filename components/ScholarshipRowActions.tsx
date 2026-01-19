"use client";

import { useState, useTransition } from "react";

type Action =
  | { kind: "requestPublish" }
  | { kind: "unpublish" }
  | { kind: "delete" }
  | {
      kind: "adminSetStatus";
      status: "PUBLISHED" | "UNPUBLISHED" | "RESTRICTED" | "DRAFT";
    }
  | { kind: "adminFeature"; featured: boolean };

export default function ScholarshipRowActions({
  scholarshipId,
  mode,
  featured,
}: {
  scholarshipId: string;
  mode: "donor" | "admin";
  featured?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: Action) {
    setError(null);
    startTransition(async () => {
      const res = await fetch(actionToUrl(scholarshipId, action), {
        method: actionToMethod(action),
        headers: { "content-type": "application/json" },
        body: actionToBody(action),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Action failed");
        return;
      }

      window.location.reload();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {mode === "donor" ? (
          <>
            <button
              disabled={isPending}
              onClick={() => run({ kind: "requestPublish" })}
              className="rounded-xl bg-black px-3 py-2 text-xs font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              Request publish
            </button>
            <button
              disabled={isPending}
              onClick={() => run({ kind: "unpublish" })}
              className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
            >
              Unpublish
            </button>
            <button
              disabled={isPending}
              onClick={() => {
                if (!confirm("Delete this scholarship? This cannot be undone."))
                  return;
                run({ kind: "delete" });
              }}
              className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-500/10 disabled:opacity-50 dark:text-red-300"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              disabled={isPending}
              onClick={() =>
                run({ kind: "adminSetStatus", status: "PUBLISHED" })
              }
              className="rounded-xl bg-black px-3 py-2 text-xs font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              Publish
            </button>
            <button
              disabled={isPending}
              onClick={() =>
                run({ kind: "adminSetStatus", status: "UNPUBLISHED" })
              }
              className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
            >
              Unpublish
            </button>
            <button
              disabled={isPending}
              onClick={() =>
                run({ kind: "adminSetStatus", status: "RESTRICTED" })
              }
              className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-xs font-medium text-orange-700 hover:bg-orange-500/10 disabled:opacity-50 dark:text-orange-300"
            >
              Restrict
            </button>
            <button
              disabled={isPending}
              onClick={() => run({ kind: "adminSetStatus", status: "DRAFT" })}
              className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
            >
              Set draft
            </button>
            <button
              disabled={isPending}
              onClick={() =>
                run({ kind: "adminFeature", featured: !(featured ?? false) })
              }
              className="rounded-xl border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
            >
              {featured ? "Unfeature" : "Feature"}
            </button>
            <button
              disabled={isPending}
              onClick={() => {
                if (!confirm("Delete this scholarship? This cannot be undone."))
                  return;
                run({ kind: "delete" });
              }}
              className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-500/10 disabled:opacity-50 dark:text-red-300"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}
    </div>
  );
}

function actionToUrl(id: string, action: Action) {
  switch (action.kind) {
    case "requestPublish":
      return `/api/scholarships/${id}/request-publish`;
    case "unpublish":
      return `/api/scholarships/${id}/unpublish`;
    case "delete":
      return `/api/scholarships/${id}`;
    case "adminSetStatus":
      return `/api/admin/scholarships/${id}/status`;
    case "adminFeature":
      return `/api/admin/scholarships/${id}/feature`;
  }
}

function actionToMethod(action: Action) {
  switch (action.kind) {
    case "delete":
      return "DELETE";
    case "adminSetStatus":
    case "adminFeature":
      return "PATCH";
    default:
      return "POST";
  }
}

function actionToBody(action: Action) {
  switch (action.kind) {
    case "adminSetStatus":
      return JSON.stringify({ status: action.status });
    case "adminFeature":
      return JSON.stringify({ featured: action.featured });
    default:
      return undefined;
  }
}
