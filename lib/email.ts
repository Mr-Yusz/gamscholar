import nodemailer from "nodemailer";

const FOOTER = `\n\n---\nSupport: yj22011025@utg.edu.gm\nPhone: (3674537)`;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.NOREPLY_EMAIL || "no-reply@localhost";
  return { host, port, user, pass, from };
}

function canSend() {
  const { host, port, user, pass } = getSmtpConfig();
  return Boolean(host && port && user && pass);
}

async function createTransporter() {
  const { host, port, user, pass } = getSmtpConfig();
  if (!host || !port || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

type RejectionOptions = {
  to: string;
  fullName?: string | null;
  reason?: string | null;
};

export async function sendRejectionEmail(opts: RejectionOptions) {
  const { to, fullName, reason } = opts;
  const { from } = getSmtpConfig();

  const subject = `${fullName ?? "Applicant"} — Application update`;
  const body = `Hello ${fullName ?? "Applicant"},\n\nWe wanted to let you know that your application was not shortlisted.${reason ? "\n\nReason provided:\n" + reason + "\n" : ""}\n\nIf you have questions, contact the scholarship donor or admin.\n\nBest regards\n`;

  if (!canSend()) {
    console.log("[email] (dev) would send to:", to);
    console.log("[email] subject:", subject);
    console.log("[email] body:\n", body + FOOTER);
    return;
  }

  const transporter = await createTransporter();
  if (!transporter) return;

  await transporter.sendMail({ from, to, subject, text: body + FOOTER });
}

type AcceptanceOptions = {
  to: string;
  fullName?: string | null;
  nextSteps?: string | null;
  scholarshipTitle?: string | null;
};

export async function sendAcceptanceEmail(opts: AcceptanceOptions) {
  const { to, fullName, nextSteps, scholarshipTitle } = opts;
  const { from } = getSmtpConfig();

  const subject = `${fullName ?? "Applicant"} — Congratulations! You've been shortlisted`;
  const body = `Hello ${fullName ?? "Applicant"},\n\nCongratulations! We are pleased to inform you that your application${scholarshipTitle ? " for \"" + scholarshipTitle + "\"" : ""} has been shortlisted.${nextSteps ? "\n\nNext Steps:\n" + nextSteps + "\n" : ""}\n\nYou can view more details about your application status in your student dashboard.\n\nBest regards\n`;

  if (!canSend()) {
    console.log("[email] (dev) would send to:", to);
    console.log("[email] subject:", subject);
    console.log("[email] body:\n", body + FOOTER);
    return;
  }

  const transporter = await createTransporter();
  if (!transporter) return;

  await transporter.sendMail({ from, to, subject, text: body + FOOTER });
}

type SubmissionOptions = {
  to: string;
  studentName?: string | null;
  scholarshipId?: string | null;
  scholarshipTitle?: string | null;
};

export async function sendSubmissionEmail(opts: SubmissionOptions) {
  const { to, studentName, scholarshipId, scholarshipTitle } = opts;
  const { from } = getSmtpConfig();

  const subject = `New application received for your scholarship`;
  const body = `Hello,\n\nA new student application has been submitted${studentName ? " by " + studentName : ""} for your scholarship${scholarshipTitle ? " \"" + scholarshipTitle + "\"" : ""}.${scholarshipId ? "\n\nApplication ID: " + scholarshipId : ""}\n\nVisit the dashboard to review the applicant.\n\nBest regards\n`;

  if (!canSend()) {
    console.log("[email] (dev) would send to:", to);
    console.log("[email] subject:", subject);
    console.log("[email] body:\n", body + FOOTER);
    return;
  }

  const transporter = await createTransporter();
  if (!transporter) return;

  await transporter.sendMail({ from, to, subject, text: body + FOOTER });
}
