import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

interface NormalizedJob {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  url: string;
  tags: string[];
  description: string;
  publishedAt: string;
  source: string;
}

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

async function getUserSettings(userId?: string | null) {
  if (userId) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase.from("app_settings").select("*").eq("id", userId).maybeSingle();
        if (data) {
          return {
            jobSearchProvider: data.job_search_provider || "open_apis",
            rapidapiKey: data.rapidapi_key || "",
            adzunaAppId: data.adzuna_app_id || "",
            adzunaAppKey: data.adzuna_app_key || "",
            serpapiKey: data.serpapi_key || "",
          };
        }
      } catch (e) {}
    }

    const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "");
    const userSettingsFile = path.join(process.cwd(), "data", `settings_${safe}.json`);
    if (fs.existsSync(userSettingsFile)) {
      try {
        return JSON.parse(fs.readFileSync(userSettingsFile, "utf-8"));
      } catch (e) {}
    }
  }

  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    } catch (e) {}
  }

  return {
    jobSearchProvider: "open_apis",
    rapidapiKey: "",
    adzunaAppId: "",
    adzunaAppKey: "",
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || "software").trim();
    const userId = searchParams.get("userId");

    const settings = await getUserSettings(userId);
    const jobs: NormalizedJob[] = [];

    // 1. If candidate configured RapidAPI JSearch
    if (settings.jobSearchProvider === "rapidapi_jsearch" && settings.rapidapiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const rapidRes = await fetch(
          `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`,
          {
            signal: controller.signal,
            headers: {
              "X-RapidAPI-Key": settings.rapidapiKey,
              "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            },
          }
        );
        clearTimeout(timeoutId);

        if (rapidRes.ok) {
          const data = await rapidRes.json();
          if (Array.isArray(data.data)) {
            for (const item of data.data.slice(0, 30)) {
              jobs.push({
                id: "jsearch-" + (item.job_id || Math.random().toString(36).substring(7)),
                company: item.employer_name || "Company",
                role: item.job_title || query,
                location: item.job_city ? `${item.job_city}, ${item.job_country || ""}` : (item.job_is_remote ? "Remote" : "Global"),
                salary: item.job_min_salary ? `$${item.job_min_salary} - $${item.job_max_salary || ""}` : "",
                url: item.job_apply_link || item.job_google_link || "https://linkedin.com",
                tags: [item.job_employment_type, item.job_publisher].filter(Boolean),
                description: item.job_description ? item.job_description.slice(0, 240) + "..." : "",
                publishedAt: item.job_posted_at_datetime_utc ? item.job_posted_at_datetime_utc.split("T")[0] : "Recent",
                source: "JSearch (LinkedIn/Indeed)",
              });
            }
          }
        }
      } catch (err) {
        console.warn("RapidAPI JSearch query error, falling back to open feeds:", err);
      }
    }

    // 2. If candidate configured Adzuna API
    if (settings.jobSearchProvider === "adzuna" && settings.adzunaAppId && settings.adzunaAppKey && jobs.length === 0) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const adzunaRes = await fetch(
          `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${encodeURIComponent(settings.adzunaAppId)}&app_key=${encodeURIComponent(settings.adzunaAppKey)}&what=${encodeURIComponent(query)}&results_per_page=25`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (adzunaRes.ok) {
          const data = await adzunaRes.json();
          if (Array.isArray(data.results)) {
            for (const item of data.results) {
              jobs.push({
                id: "adzuna-" + item.id,
                company: item.company?.display_name || "Tech Company",
                role: item.title?.replace(/<[^>]*>?/gm, "") || query,
                location: item.location?.display_name || "Remote / US",
                salary: item.salary_min ? `$${Math.round(item.salary_min)} - $${Math.round(item.salary_max || item.salary_min)}` : "",
                url: item.redirect_url || "https://adzuna.com",
                tags: [item.category?.label].filter(Boolean),
                description: item.description ? item.description.slice(0, 240) + "..." : "",
                publishedAt: item.created ? item.created.split("T")[0] : "Recent",
                source: "Adzuna API",
              });
            }
          }
        }
      } catch (err) {
        console.warn("Adzuna API error, falling back to open feeds:", err);
      }
    }

    // 3. Fallback or Default: Built-in Open Tech Feeds (Remotive & Arbeitnow)
    if (jobs.length === 0) {
      // Fetch from Remotive API
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const remotiveRes = await fetch(
          `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=25`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (remotiveRes.ok) {
          const data = await remotiveRes.json();
          if (Array.isArray(data.jobs)) {
            for (const item of data.jobs) {
              jobs.push({
                id: "remotive-" + item.id,
                company: item.company_name?.trim() || "Tech Company",
                role: item.title?.trim() || "Software Engineer",
                location: item.candidate_required_location || "Remote Worldwide",
                salary: item.salary || "",
                url: item.url || "https://remotive.com",
                tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
                description: item.description ? item.description.replace(/<[^>]*>?/gm, "").slice(0, 240) + "..." : "",
                publishedAt: item.publication_date ? item.publication_date.split("T")[0] : "Recent",
                source: "Remotive",
              });
            }
          }
        }
      } catch (err) {
        console.warn("Remotive API fetch warning:", err);
      }

      // Fetch from Arbeitnow API
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const arbeitRes = await fetch("https://www.arbeitnow.com/api/job-board-api", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (arbeitRes.ok) {
          const data = await arbeitRes.json();
          if (Array.isArray(data.data)) {
            const matched = data.data.filter((item: any) => {
              const text = `${item.title} ${item.company_name} ${(item.tags || []).join(" ")}`.toLowerCase();
              return text.includes(query.toLowerCase());
            });

            for (const item of matched.slice(0, 25)) {
              jobs.push({
                id: "arbeit-" + (item.slug || Math.random().toString(36).substring(7)),
                company: item.company_name?.trim() || "Tech Company",
                role: item.title?.trim() || "Software Engineer",
                location: item.remote ? "Remote (" + (item.location || "Global") + ")" : (item.location || "On-site / Hybrid"),
                salary: "",
                url: item.url || "https://www.arbeitnow.com",
                tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
                description: item.description ? item.description.replace(/<[^>]*>?/gm, "").slice(0, 240) + "..." : "",
                publishedAt: item.created_at ? new Date(item.created_at * 1000).toISOString().split("T")[0] : "Recent",
                source: "Arbeitnow",
              });
            }
          }
        }
      } catch (err) {
        console.warn("Arbeitnow API fetch warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      query,
      count: jobs.length,
      provider: settings.jobSearchProvider || "open_apis",
      jobs,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
