import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

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
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const settings = getSettings();

    const host = body.host || settings.smtpHost;
    const port = Number(body.port || settings.smtpPort);
    const user = body.user || settings.smtpUser;
    const pass = body.key || settings.smtpKey || process.env.BREVO_SMTP_KEY || "";
    if (!pass) {
      return NextResponse.json(
        { success: false, error: "SMTP key is required. Configure it in settings or set BREVO_SMTP_KEY." },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      latencyMs,
      message: `Authentication succeeded with ${host}:${port}! Relay is ready.`,
      config: {
        host,
        port,
        user,
      },
    });
  } catch (error: any) {
    console.error("SMTP verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to SMTP relay server",
      },
      { status: 500 }
    );
  }
}
