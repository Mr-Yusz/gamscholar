"use client";

import { useMemo, useState, useTransition } from "react";

type DocMeta = {
  id: string;
  filename: string;
  mimeType: string;
  kind: "PDF" | "IMAGE" | "OTHER";
};

type WizardProps = {
  scholarshipId: string;
  application: {
    id: string;
    currentStep: number;
    stepData: any;
    documents: DocMeta[];
  };
};

export default function ApplicationWizard({
  scholarshipId,
  application,
}: WizardProps) {
  const [step, setStep] = useState<number>(application.currentStep || 1);
  const [data, setData] = useState<any>(application.stepData || {});
  const [docs, setDocs] = useState<DocMeta[]>(application.documents || []);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const summary = useMemo(() => {
    const personal = data.personal ?? {};
    const academic = data.academic ?? {};
    return {
      personal,
      academic,
      docs,
    };
  }, [data, docs]);

  async function save(nextStep: number, patch: any) {
    const res = await fetch(`/api/applications/${application.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentStep: nextStep, stepData: patch }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new Error(json?.error ?? "Could not save");
    }
    const json = await res.json();
    setData(json.application.stepData);
    setStep(json.application.currentStep);
  }

  function nextFrom(stepPatch: any) {
    setError(null);
    startTransition(async () => {
      try {
        const nextStep = Math.min(4, step + 1);
        await save(nextStep, stepPatch);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  function back() {
    setError(null);
    startTransition(async () => {
      try {
        const prev = Math.max(1, step - 1);
        await save(prev, {});
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  async function uploadFile(file: File) {
    const base64 = await fileToBase64(file);
    const kind = file.type.includes("pdf")
      ? "PDF"
      : file.type.startsWith("image/")
        ? "IMAGE"
        : "OTHER";

    const res = await fetch(`/api/applications/${application.id}/documents`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        kind,
        base64,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new Error(json?.error ?? "Upload failed");
    }

    const json = await res.json();
    setDocs((d) => [...d, json.document]);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/applications/${application.id}/submit`, {
          method: "POST",
        });
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.error ?? "Submit failed");
        }
        window.location.href = "/dashboard/student";
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Progress step={step} />

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <StepPersonal
          initial={data.personal ?? {}}
          disabled={isPending}
          onNext={(patch) => {
            // simple required validation
            if (!patch.personal.fullName || !patch.personal.phone) {
              setError("Please add your full name and phone.");
              return;
            }
            setData((d: any) => ({ ...d, ...patch }));
            nextFrom(patch);
          }}
        />
      ) : null}

      {step === 2 ? (
        <StepAcademic
          initial={data.academic ?? {}}
          disabled={isPending}
          onBack={back}
          onNext={(patch) => {
            if (!patch.academic.institution || !patch.academic.level) {
              setError("Please add your institution and level.");
              return;
            }
            setData((d: any) => ({ ...d, ...patch }));
            nextFrom(patch);
          }}
        />
      ) : null}

      {step === 3 ? (
        <StepDocuments
          disabled={isPending}
          docs={docs}
          onBack={back}
          onUpload={async (file) => {
            setError(null);
            startTransition(async () => {
              try {
                await uploadFile(file);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Upload failed");
              }
            });
          }}
          onNext={() => {
            nextFrom({});
          }}
        />
      ) : null}

      {step === 4 ? (
        <StepReview
          scholarshipId={scholarshipId}
          summary={summary}
          disabled={isPending}
          onBack={back}
          onConfirm={() => setShowConfirm(true)}
        />
      ) : null}

      {showConfirm ? (
        <ConfirmModal
          summary={summary}
          onCancel={() => setShowConfirm(false)}
          onSubmit={submit}
          disabled={isPending}
        />
      ) : null}
    </div>
  );
}

function Progress({ step }: { step: number }) {
  const items = [
    { n: 1, label: "Personal" },
    { n: 2, label: "Academic" },
    { n: 3, label: "Documents" },
    { n: 4, label: "Review" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <div
          key={i.n}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            step === i.n
              ? "bg-black text-white dark:bg-white dark:text-black"
              : step > i.n
                ? "bg-black/10 text-zinc-800 dark:bg-white/10 dark:text-zinc-200"
                : "bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-400"
          }`}
        >
          {i.n}. {i.label}
        </div>
      ))}
    </div>
  );
}

function StepPersonal({
  initial,
  disabled,
  onNext,
}: {
  initial: any;
  disabled: boolean;
  onNext: (patch: any) => void;
}) {
  const [fullName, setFullName] = useState(initial.fullName ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [dob, setDob] = useState(initial.dob ?? "");
  const [address, setAddress] = useState(initial.address ?? "");

  return (
    <Panel title="Step 1: Personal information">
      <Grid>
        <Field label="Full name">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={input()}
          />
        </Field>
        <Field label="Phone">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={input()}
          />
        </Field>
        <Field label="Date of birth" hint="Optional">
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={input()}
          />
        </Field>
        <Field label="Address" hint="Optional">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={input()}
          />
        </Field>
      </Grid>

      <div className="mt-6 flex justify-end">
        <button
          disabled={disabled}
          onClick={() =>
            onNext({
              personal: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                dob,
                address: address.trim(),
              },
            })
          }
          className={primaryBtn()}
          type="button"
        >
          Next
        </button>
      </div>
    </Panel>
  );
}

function StepAcademic({
  initial,
  disabled,
  onBack,
  onNext,
}: {
  initial: any;
  disabled: boolean;
  onBack: () => void;
  onNext: (patch: any) => void;
}) {
  const [institution, setInstitution] = useState(initial.institution ?? "");
  const [level, setLevel] = useState(initial.level ?? "");
  const [program, setProgram] = useState(initial.program ?? "");
  const [gpa, setGpa] = useState(initial.gpa ?? "");

  return (
    <Panel title="Step 2: Academic background">
      <Grid>
        <Field label="Institution">
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className={input()}
          />
        </Field>
        <Field label="Level">
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="e.g. Undergraduate"
            className={input()}
          />
        </Field>
        <Field label="Program" hint="Optional">
          <input
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className={input()}
          />
        </Field>
        <Field label="GPA" hint="Optional">
          <input
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            className={input()}
          />
        </Field>
      </Grid>

      <div className="mt-6 flex items-center justify-between">
        <button
          disabled={disabled}
          onClick={onBack}
          className={secondaryBtn()}
          type="button"
        >
          Back
        </button>
        <button
          disabled={disabled}
          onClick={() =>
            onNext({
              academic: {
                institution: institution.trim(),
                level: level.trim(),
                program: program.trim(),
                gpa: gpa.trim(),
              },
            })
          }
          className={primaryBtn()}
          type="button"
        >
          Next
        </button>
      </div>
    </Panel>
  );
}

function StepDocuments({
  disabled,
  docs,
  onBack,
  onUpload,
  onNext,
}: {
  disabled: boolean;
  docs: DocMeta[];
  onBack: () => void;
  onUpload: (file: File) => void;
  onNext: () => void;
}) {
  return (
    <Panel title="Step 3: Documents">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Upload any supporting documents (PDF/images). Files are stored as base64
        for this demo.
      </div>

      <div className="mt-4">
        <input
          type="file"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onUpload(file);
            e.currentTarget.value = "";
          }}
        />
      </div>

      <div className="mt-4">
        {docs.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-400">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl border border-black/10 bg-white p-4 text-sm dark:border-white/10 dark:bg-black"
              >
                <div className="font-medium">{d.filename}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  {d.kind} • {d.mimeType}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          disabled={disabled}
          onClick={onBack}
          className={secondaryBtn()}
          type="button"
        >
          Back
        </button>
        <button
          disabled={disabled}
          onClick={onNext}
          className={primaryBtn()}
          type="button"
        >
          Next
        </button>
      </div>
    </Panel>
  );
}

function StepReview({
  scholarshipId,
  summary,
  disabled,
  onBack,
  onConfirm,
}: {
  scholarshipId: string;
  summary: any;
  disabled: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <Panel title="Step 4: Review & confirm">
      <div className="space-y-4 text-sm">
        <div>
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Personal
          </div>
          <div className="mt-1 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
            <div>
              <span className="font-medium">Name:</span>{" "}
              {summary.personal.fullName || "—"}
            </div>
            <div>
              <span className="font-medium">Phone:</span>{" "}
              {summary.personal.phone || "—"}
            </div>
            <div>
              <span className="font-medium">DOB:</span>{" "}
              {summary.personal.dob || "—"}
            </div>
            <div>
              <span className="font-medium">Address:</span>{" "}
              {summary.personal.address || "—"}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Academic
          </div>
          <div className="mt-1 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
            <div>
              <span className="font-medium">Institution:</span>{" "}
              {summary.academic.institution || "—"}
            </div>
            <div>
              <span className="font-medium">Level:</span>{" "}
              {summary.academic.level || "—"}
            </div>
            <div>
              <span className="font-medium">Program:</span>{" "}
              {summary.academic.program || "—"}
            </div>
            <div>
              <span className="font-medium">GPA:</span>{" "}
              {summary.academic.gpa || "—"}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Documents
          </div>
          <div className="mt-1 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
            {summary.docs.length === 0
              ? "—"
              : summary.docs.map((d: any) => d.filename).join(", ")}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          disabled={disabled}
          onClick={onBack}
          className={secondaryBtn()}
          type="button"
        >
          Back
        </button>
        <button
          disabled={disabled}
          onClick={onConfirm}
          className={primaryBtn()}
          type="button"
        >
          Submit application
        </button>
      </div>

      <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
        Scholarship ID: {scholarshipId}
      </div>
    </Panel>
  );
}

function ConfirmModal({
  summary,
  onCancel,
  onSubmit,
  disabled,
}: {
  summary: any;
  onCancel: () => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-black">
        <h3 className="text-lg font-semibold">Confirm submission</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Please confirm the information below before submitting.
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Personal
            </div>
            <div className="mt-1">
              {summary.personal.fullName} • {summary.personal.phone}
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Academic
            </div>
            <div className="mt-1">
              {summary.academic.institution} • {summary.academic.level}
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Documents
            </div>
            <div className="mt-1">
              {summary.docs.length === 0
                ? "None"
                : summary.docs.map((d: any) => d.filename).join(", ")}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={disabled}
            onClick={onCancel}
            className={secondaryBtn()}
            type="button"
          >
            Cancel
          </button>
          <button
            disabled={disabled}
            onClick={onSubmit}
            className={primaryBtn()}
            type="button"
          >
            Confirm & submit
          </button>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
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

function input() {
  return "h-12 w-full rounded-2xl border border-black/10 bg-transparent px-4 outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20";
}

function primaryBtn() {
  return "h-12 rounded-2xl bg-black px-5 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80";
}

function secondaryBtn() {
  return "h-12 rounded-2xl border border-black/10 px-5 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result || "");
      // strip `data:mime/type;base64,` prefix
      const idx = res.indexOf(",");
      resolve(idx >= 0 ? res.slice(idx + 1) : res);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
