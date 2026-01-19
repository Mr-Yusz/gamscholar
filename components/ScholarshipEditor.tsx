"use client";

import { useMemo, useState, useTransition } from "react";

type Initial = {
  id?: string;
  title?: string;
  amountGmd?: number;
  degree?: string;
  field?: string;
  description?: string;
  deadline?: string | null;
  eligibility?: string[];
};

export default function ScholarshipEditor({ initial }: { initial?: Initial }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [amountGmd, setAmountGmd] = useState(String(initial?.amountGmd ?? ""));
  const [degree, setDegree] = useState(initial?.degree ?? "");
  const [field, setField] = useState(initial?.field ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");

  const [eligibilityText, setEligibilityText] = useState(
    (initial?.eligibility ?? []).join("\n"),
  );

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const eligibility = useMemo(
    () =>
      eligibilityText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    [eligibilityText],
  );

  const isEdit = Boolean(initial?.id);

  function payload(saveAsDraft: boolean) {
    return {
      title,
      amountGmd: Number(amountGmd),
      degree,
      field,
      description,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      eligibility,
      ...(isEdit ? {} : { saveAsDraft }),
    };
  }

  async function create(saveAsDraft: boolean) {
    const res = await fetch("/api/scholarships", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload(saveAsDraft)),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "Create failed");
    }

    const data = await res.json();
    return data.scholarship.id as string;
  }

  async function update() {
    const res = await fetch(`/api/scholarships/${initial?.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload(true)),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "Update failed");
    }
  }

  function submit(saveAsDraft: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        if (isEdit) {
          await update();
          window.location.href = "/dashboard/donor";
          return;
        }

        const id = await create(saveAsDraft);
        window.location.href = `/dashboard/donor`;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
          />
        </Field>

        <Field label="Amount (GMD)">
          <input
            inputMode="numeric"
            value={amountGmd}
            onChange={(e) => setAmountGmd(e.target.value)}
            className="h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
          />
        </Field>

        <Field label="Degree">
          <input
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
          />
        </Field>

        <Field label="Field of study">
          <input
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
          />
        </Field>

        <Field label="Deadline" hint="Optional">
          <input
            type="date"
            value={deadline ?? ""}
            onChange={(e) => setDeadline(e.target.value)}
            className="h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={7}
          className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
        />
      </Field>

      <Field label="Eligibility criteria" hint="One per line">
        <textarea
          value={eligibilityText}
          onChange={(e) => setEligibilityText(e.target.value)}
          rows={6}
          placeholder="Must be Gambian\nUndergraduate or postgraduate\n..."
          className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
        />
      </Field>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        {!isEdit ? (
          <button
            disabled={isPending}
            onClick={() => submit(true)}
            className="h-12 rounded-2xl border border-black/10 px-5 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
            type="button"
          >
            Save as draft
          </button>
        ) : null}

        <button
          disabled={isPending}
          onClick={() => submit(false)}
          className="h-12 rounded-2xl bg-black px-5 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
          type="button"
        >
          {isEdit ? "Save changes" : "Create (request publish)"}
        </button>
      </div>

      {!isEdit ? (
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Note: “Create (request publish)” will submit this scholarship for
          admin review.
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
