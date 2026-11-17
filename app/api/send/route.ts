import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "jobs.json");
const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

function getSettings() {
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    } catch (e) {}
  }
  return {
    smtpHost: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    smtpPort: process.env.BREVO_SMTP_PORT || "587",
    smtpUser: process.env.BREVO_SMTP_USER || "c2812c001@smtp-brevo.com",
    smtpKey: process.env.BREVO_SMTP_KEY || "",
    senderEmail: process.env.BREVO_SENDER_EMAIL || "tatrasiamar123@gmail.com",
    senderName: process.env.BREVO_SENDER_NAME || "Tatrasi Amar",
    replyToEmail: "tatrasiamar123@gmail.com",
    replyToName: "Tatrasi Amar",
  };
}

function recordJobEmail(jobId: string, emailSubject: string) {
  try {
    if (!fs.existsSync(DATA_FILE)) return;
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const jobs = JSON.parse(raw);
    const job = jobs.find((j: any) => j.id === jobId);
    if (job) {
      const now = new Date().toISOString().replace("T", " ").slice(0, 16);
      const today = new Date().toISOString().split("T")[0];

      if (!job.emailHistory) job.emailHistory = [];
      job.emailHistory.unshift({
        id: "em-" + Date.now(),
        subject: emailSubject,
        sentAt: now,
      });

      job.lastContactDate = today;
      if (job.status === "wishlist") {
        job.status = "applied";
      }
      if (!job.appliedDate) {
        job.appliedDate = today;
      }

      fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to auto-update job email history:", err);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const settings = getSettings();

    const {
      to,
      subject,
      body,
      html,
      attachResume,
      attachmentPath,
      attachmentFilename,
      senderName,
      senderEmail,
      replyToEmail,
      replyToName,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpKey,
      jobId,
    } = data;

    if (!to || !to.trim()) {
      return NextResponse.json(
        { success: false, error: "Recipient email is required." },
        { status: 400 }
      );
    }

    const host = smtpHost || settings.smtpHost;
    const port = Number(smtpPort || settings.smtpPort);
    const user = smtpUser || settings.smtpUser;
    const pass = smtpKey || settings.smtpKey || process.env.BREVO_SMTP_KEY || "";
    if (!pass) {
      return NextResponse.json(
        { success: false, error: "SMTP key is required. Configure it in settings or set BREVO_SMTP_KEY." },
        { status: 400 }
      );
    }
    const verifiedSender = senderEmail || settings.senderEmail;
    const displayName = senderName || settings.senderName;

    // Explicit Reply-To configuration
    const directReplyEmail = replyToEmail || settings.replyToEmail || verifiedSender;
    const directReplyName = replyToName || settings.replyToName || displayName;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 15000,
    });

    const attachments: Array<{ filename: string; path: string }> = [];

    if (attachResume) {
      if (attachmentPath && fs.existsSync(attachmentPath)) {
        attachments.push({
          filename: attachmentFilename || path.basename(attachmentPath),
          path: attachmentPath,
        });
      } else {
        const defaultResume = path.join(process.cwd(), "Tatrasi_Amar_Resume.pdf");
        if (fs.existsSync(defaultResume)) {
          attachments.push({
            filename: "Tatrasi_Amar_Resume.pdf",
            path: defaultResume,
          });
        }
      }
    }

    const mailOptions = {
      from: `"${displayName}" <${verifiedSender}>`,
      to: to.trim(),
      replyTo: `"${directReplyName}" <${directReplyEmail}>`,
      subject: subject || "Application / Inquiry",
      text: body || "Please find my resume attached.",
      html: html || undefined,
      attachments,
    };

    const startTime = Date.now();
    const info = await transporter.sendMail(mailOptions);
    const durationMs = Date.now() - startTime;

    if (jobId) {
      recordJobEmail(jobId, mailOptions.subject);
    }

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      replyTo: mailOptions.replyTo,
      durationMs,
      message: `Cold email sent! Recruiter replies will go directly to ${directReplyEmail}.`,
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to deliver email through SMTP relay.",
      },
      { status: 500 }
    );
  }
}
