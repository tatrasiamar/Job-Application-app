import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");

function getSettingsPath(userId?: string) {
  if (userId) {
    const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "");
    return path.join(DATA_DIR, `settings_${safe}.json`);
  }
  return path.join(DATA_DIR, "settings.json");
}

function getDefaultSettings() {
  return {
    smtpHost: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    smtpPort: process.env.BREVO_SMTP_PORT || "587",
    smtpUser: process.env.BREVO_SMTP_USER || "c2812c001@smtp-brevo.com",
    smtpKey: "",
    senderEmail: process.env.BREVO_SENDER_EMAIL || "tatrasiamar123@gmail.com",
    senderName: process.env.BREVO_SENDER_NAME || "Tatrasi Amar",
    replyToEmail: process.env.BREVO_SENDER_EMAIL || "tatrasiamar123@gmail.com",
    replyToName: process.env.BREVO_SENDER_NAME || "Tatrasi Amar",

    // BYOK - Cold Mailing APIs
    coldMailProvider: "smtp", // "smtp", "brevo", "gmail", "custom"
    coldMailApiKey: "",

    // BYOK - Job Searching APIs
    jobSearchProvider: "open_apis", // "open_apis", "rapidapi_jsearch", "adzuna", "serpapi"
    rapidapiKey: "",
    adzunaAppId: "",
    adzunaAppKey: "",
    serpapiKey: "",
    customJobSearchUrl: "",
  };
}

function getLocalSettings(userId?: string) {
  const file = getSettingsPath(userId);
  if (fs.existsSync(file)) {
    try {
      const raw = fs.readFileSync(file, "utf-8").replace(/^\uFEFF/, "");
      return { ...getDefaultSettings(), ...JSON.parse(raw) };
    } catch (err) {
      console.error("Error reading settings:", err);
    }
  }

  // Fallback to default settings.json
  const defFile = path.join(DATA_DIR, "settings.json");
  if (fs.existsSync(defFile)) {
    try {
      const raw = fs.readFileSync(defFile, "utf-8").replace(/^\uFEFF/, "");
      return { ...getDefaultSettings(), ...JSON.parse(raw) };
    } catch (err) {}
  }

  return getDefaultSettings();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        const mapped = {
          smtpHost: data.smtp_host || "smtp-relay.brevo.com",
          smtpPort: data.smtp_port || "587",
          smtpUser: data.smtp_user || "",
          smtpKey: data.smtp_key || "",
          senderEmail: data.sender_email || "",
          senderName: data.sender_name || "",
          replyToEmail: data.reply_to_email || "",
          replyToName: data.reply_to_name || "",
          coldMailProvider: data.cold_mail_provider || "smtp",
          coldMailApiKey: data.cold_mail_api_key || "",
          jobSearchProvider: data.job_search_provider || "open_apis",
          rapidapiKey: data.rapidapi_key || "",
          adzunaAppId: data.adzuna_app_id || "",
          adzunaAppKey: data.adzuna_app_key || "",
          serpapiKey: data.serpapi_key || "",
          customJobSearchUrl: data.custom_job_search_url || "",
        };
        return NextResponse.json({ success: true, settings: mapped, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase GET settings fallback to local:", err);
    }
  }

  return NextResponse.json({ success: true, settings: getLocalSettings(userId || undefined), source: "local" });
}

export async function PUT(request: Request) {
  try {
    const updated = await request.json();
    const userId = updated.userId;
    const supabase = getSupabase();

    if (supabase && userId) {
      try {
        await supabase.from("app_settings").upsert({
          id: userId,
          smtp_host: updated.smtpHost,
          smtp_port: updated.smtpPort,
          smtp_user: updated.smtpUser,
          smtp_key: updated.smtpKey,
          sender_email: updated.senderEmail,
          sender_name: updated.senderName,
          reply_to_email: updated.replyToEmail,
          reply_to_name: updated.replyToName,
          cold_mail_provider: updated.coldMailProvider || "smtp",
          cold_mail_api_key: updated.coldMailApiKey || "",
          job_search_provider: updated.jobSearchProvider || "open_apis",
          rapidapi_key: updated.rapidapiKey || "",
          adzuna_app_id: updated.adzunaAppId || "",
          adzuna_app_key: updated.adzunaAppKey || "",
          serpapi_key: updated.serpapiKey || "",
          custom_job_search_url: updated.customJobSearchUrl || "",
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase PUT settings warning:", err);
      }
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });
    const targetFile = getSettingsPath(userId);
    fs.writeFileSync(targetFile, JSON.stringify(updated, null, 2), "utf-8");

    // Also update generic settings.json if not set
    const genericFile = path.join(DATA_DIR, "settings.json");
    if (!fs.existsSync(genericFile)) {
      fs.writeFileSync(genericFile, JSON.stringify(updated, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
