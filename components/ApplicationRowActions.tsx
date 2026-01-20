"use client";

import { useState, useEffect } from "react";

export default function ApplicationRowActions({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<Array<{ id: string; filename: string; mimeType: string; base64: string }>>([]);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [acceptNextSteps, setAcceptNextSteps] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch application status on mount
  useEffect(() => {
    async function fetchApplicationStatus() {
      try {
        const res = await fetch(`/api/applications/${applicationId}/documents`);
        if (res.ok) {
          const json = await res.json();
          setApplicationData(json.application ?? null);
        }
      } catch (e) {
        console.error("Failed to fetch application status:", e);
      }
    }
    fetchApplicationStatus();
  }, [applicationId]);

  async function fetchDocs() {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/documents`);
      if (!res.ok) throw new Error("Could not load documents");
      const json = await res.json();
      setDocs(json.documents || []);
      setApplicationData(json.application ?? null);
      setShowDocs(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  function openDoc(doc: { filename: string; mimeType: string; base64: string }) {
    try {
      const binary = atob(doc.base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: doc.mimeType });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      alert("Could not open document");
    }
  }

  async function decide(decision: "ACCEPT" | "REJECT") {
    if (decision === "REJECT") {
      // open rejection modal (ensure we have application data)
      if (!applicationData) {
        await fetchDocs();
      }
      setShowRejectModal(true);
      return;
    }

    if (decision === "ACCEPT") {
      // open acceptance modal (ensure we have application data)
      if (!applicationData) {
        await fetchDocs();
      }
      setShowAcceptModal(true);
      return;
    }
  }

  async function sendAcceptance() {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decision: "ACCEPT", note: acceptNextSteps }),
      });
      if (!res.ok) throw new Error("Could not update application");

      const studentName = applicationData?.student?.name ?? "the student";
      setToastMessage(`An email will be sent to ${studentName} notifying them they were shortlisted.`);
      setShowAcceptModal(false);
      // show toast briefly then reload to update status
      setTimeout(() => {
        setToastMessage(null);
        window.location.reload();
      }, 2000);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function sendRejection() {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decision: "REJECT", note: rejectReason }),
      });
      if (!res.ok) throw new Error("Could not update application");

      const studentName = applicationData?.student?.name ?? "the student";
      setToastMessage(`An email will be sent to ${studentName} notifying them they were not shortlisted.`);
      setShowRejectModal(false);
      // show toast briefly then reload to update status
      setTimeout(() => {
        setToastMessage(null);
        window.location.reload();
      }, 2000);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={fetchDocs}
        disabled={loading}
        className="rounded-2xl border border-black/10 px-3 py-2 text-xs hover:bg-black/5"
        type="button"
      >
        View documents
      </button>

      {!(applicationData?.status === "ACCEPTED" || applicationData?.status === "REJECTED") ? (
        <>
          <button
            onClick={() => decide("ACCEPT")}
            disabled={loading}
            className="rounded-2xl bg-green-600 px-3 py-2 text-xs text-white hover:bg-green-700"
            type="button"
          >
            Accept
          </button>

          <button
            onClick={() => decide("REJECT")}
            disabled={loading}
            className="rounded-2xl px-3 py-2 text-xs text-white"
            style={{ backgroundColor: "#b91c1c" }}
            type="button"
          >
            Reject
          </button>
        </>
      ) : null}

      {showDocs ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-black/10 bg-black p-6 text-white shadow-xl dark:border-white/10">
            <h3 className="text-lg font-semibold text-white">Application details & Documents</h3>

            <div className="mt-4 space-y-3 text-sm">
              {applicationData ? (
                <div className="rounded-2xl border border-black/10 p-3">
                  <div className="text-sm text-white">Student: <span className="font-medium">{applicationData.student?.name ?? applicationData.student?.email}</span></div>
                  <div className="mt-1 text-xs text-white/80">Email: <span className="font-medium text-white">{applicationData.student?.email ?? "—"}</span></div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-xs text-white/80">Full name</div>
                      <div className="font-medium text-white">{applicationData.stepData?.personal?.fullName ?? applicationData.student?.name ?? "—"}</div>

                      <div className="mt-2 text-xs text-white/80">Date of birth</div>
                      <div className="text-white">{applicationData.stepData?.personal?.dob ?? "—"}</div>

                      <div className="mt-2 text-xs text-white/80">Phone</div>
                      <div className="text-white">{applicationData.stepData?.personal?.phone ?? "—"}</div>

                      <div className="mt-2 text-xs text-white/80">Address</div>
                      <div className="text-white">{applicationData.stepData?.personal?.address ?? "—"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-white/80">GPA</div>
                      <div className="font-medium text-white">{applicationData.stepData?.academic?.gpa ?? "—"}</div>

                      <div className="mt-2 text-xs text-white/80">Level</div>
                      <div className="text-white">{applicationData.stepData?.academic?.level ?? "—"}</div>

                      <div className="mt-2 text-xs text-white/80">Program</div>
                      <div className="text-white">{applicationData.stepData?.academic?.program ?? "—"}</div>

                      <div className="mt-2 text-xs text-white/80">Institution</div>
                      <div className="text-white">{applicationData.stepData?.academic?.institution ?? "—"}</div>
                    </div>
                  </div>
                </div>
              ) : null}

              {docs.length === 0 ? (
                <div className="text-sm text-white">No documents uploaded.</div>
              ) : (
                docs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-2xl border border-black/10 p-3">
                    <div>
                      <div className="font-medium text-white">{d.filename}</div>
                      <div className="text-xs text-white">{d.mimeType}</div>
                    </div>
                    <div>
                      <button onClick={() => openDoc(d)} className="rounded px-3 py-1 border text-xs">Open</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowDocs(false)} className="rounded-2xl border px-4 py-2">Close</button>
            </div>
          </div>
        </div>
      ) : null}

      {showRejectModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Reason for rejection</h3>
            <p className="mt-2 text-sm text-zinc-600">Provide a brief reason for rejecting this application. An email will be sent to the applicant.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-4 w-full rounded-md border p-3 text-sm"
              rows={5}
            />

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowRejectModal(false)} className="rounded-2xl border px-4 py-2">Cancel</button>
              <button onClick={sendRejection} disabled={loading} className="rounded-2xl bg-red-600 px-4 py-2 text-white">Send rejection</button>
            </div>
          </div>
        </div>
      ) : null}

      {showAcceptModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-6 shadow-xl dark:bg-zinc-900 dark:border-white/10">
            <h3 className="text-lg font-semibold">Accept Application - Next Steps</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Provide information about next steps for the shortlisted applicant. This will be sent via email and displayed in their application tracker.</p>
            <textarea
              value={acceptNextSteps}
              onChange={(e) => setAcceptNextSteps(e.target.value)}
              placeholder="e.g., Please submit your final transcript by January 30th. An interview will be scheduled for February 5th. Contact us at donor@email.com for questions."
              className="mt-4 w-full rounded-md border p-3 text-sm dark:bg-zinc-800 dark:border-white/10"
              rows={6}
            />

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowAcceptModal(false)} className="rounded-2xl border px-4 py-2 dark:border-white/10">Cancel</button>
              <button onClick={sendAcceptance} disabled={loading} className="rounded-2xl bg-green-600 px-4 py-2 text-white hover:bg-green-700">Send acceptance</button>
            </div>
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-black/90 px-4 py-3 text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
