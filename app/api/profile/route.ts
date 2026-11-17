import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");

function getProfilePath(userId?: string) {
  if (userId) {
    const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "");
    return path.join(DATA_DIR, `profile_${safe}.json`);
  }
  return path.join(DATA_DIR, "profile.json");
}

function getLocalProfile(userId?: string) {
  const file = getProfilePath(userId);
  if (fs.existsSync(file)) {
    try {
      const raw = fs.readFileSync(file, "utf-8").replace(/^\uFEFF/, "");
      return JSON.parse(raw);
    } catch (err) {
      console.error("Error reading local profile:", err);
    }
  }

  // Fallback to default candidate profile
  const defaultFile = path.join(DATA_DIR, "profile.json");
  if (fs.existsSync(defaultFile)) {
    try {
      const raw = fs.readFileSync(defaultFile, "utf-8").replace(/^\uFEFF/, "");
      return JSON.parse(raw);
    } catch (err) {}
  }

  return {
    name: "Tatrasi Amar",
    title: "Full-Stack Software Engineer (Java • Spring Boot • React • Next.js)",
    email: "tatrasiamar123@gmail.com",
    phone: "+91 7330807277",
    experience: "2 years",
    skills: "Java, Spring Boot, React, Next.js, TypeScript, PostgreSQL, REST APIs, Microservices, MQTT",
    noticePeriod: "Immediate Joiner",
    location: "Hyderabad, India",
    portfolioUrl: "https://portfolio-amar.dev",
    linkedinUrl: "https://linkedin.com/in/tatrasi-amar",
    githubUrl: "https://github.com/tatrasi-amar",
    bio: "Full-Stack Software Engineer with 2 years of experience building commercial multi-tenant B2B SaaS platforms and real-time IoT architectures.",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("candidate_profile")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        const mapped = {
          name: data.name,
          title: data.title,
          email: data.email,
          phone: data.phone || "",
          experience: data.experience || "2 years",
          skills: data.skills || "",
          noticePeriod: data.notice_period || "Immediate Joiner",
          location: data.location || "",
          portfolioUrl: data.portfolio_url || "",
          linkedinUrl: data.linkedin_url || "",
          githubUrl: data.github_url || "",
          bio: data.bio || "",
        };
        return NextResponse.json({ success: true, profile: mapped, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase GET profile fallback to local:", err);
    }
  }

  const profile = getLocalProfile(userId || undefined);
  return NextResponse.json({ success: true, profile, source: "local" });
}

export async function PUT(request: Request) {
  try {
    const updated = await request.json();
    const userId = updated.userId;
    const supabase = getSupabase();

    if (supabase && userId) {
      try {
        await supabase.from("candidate_profile").upsert({
          id: userId,
          name: updated.name || "",
          title: updated.title || "",
          email: updated.email || "",
          phone: updated.phone || "",
          experience: updated.experience || "2 years",
          skills: updated.skills || "",
          notice_period: updated.noticePeriod || "Immediate Joiner",
          location: updated.location || "",
          portfolio_url: updated.portfolioUrl || "",
          linkedin_url: updated.linkedinUrl || "",
          github_url: updated.githubUrl || "",
          bio: updated.bio || "",
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase PUT profile warning:", err);
      }
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });
    const targetFile = getProfilePath(userId);
    fs.writeFileSync(targetFile, JSON.stringify(updated, null, 2), "utf-8");

    // Also update generic profile.json if not set
    const genericFile = path.join(DATA_DIR, "profile.json");
    if (!fs.existsSync(genericFile)) {
      fs.writeFileSync(genericFile, JSON.stringify(updated, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
