import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

const DATA_FILE = path.join(process.cwd(), "data", "jobs.json");

function getLocalJobs(): any[] {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8").replace(/^\uFEFF/, "");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read jobs.json:", err);
    return [];
  }
}

function saveLocalJobs(jobs: any[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2), "utf-8");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const supabase = getSupabase();

  if (supabase) {
    try {
      let query = supabase.from("jobs").select("*");
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data.map((j: any) => ({
          id: j.id,
          company: j.company,
          role: j.role,
          contactName: j.contact_name,
          contactEmail: j.contact_email,
          jobUrl: j.job_url,
          location: j.location,
          salary: j.salary,
          status: j.status,
          appliedDate: j.applied_date,
          lastContactDate: j.last_contact_date,
          notes: j.notes,
          emailHistory: j.email_history || [],
        }));
        return NextResponse.json({ success: true, jobs: mapped, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase GET jobs fallback to local:", err);
    }
  }

  const jobs = getLocalJobs();
  return NextResponse.json({ success: true, jobs, source: "local" });
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const supabase = getSupabase();

    if (action === "seed") {
      const sampleJobs = [
        {
          id: "job-" + (Date.now() - 3000),
          company: "Stripe",
          role: "Software Engineer (Java / Backend)",
          contactName: "Alex Rivera",
          contactEmail: "alex.rivera@stripe.com",
          jobUrl: "https://stripe.com/jobs",
          location: "Remote / Global",
          salary: "$130k - $160k",
          status: "applied",
          appliedDate: new Date().toISOString().split("T")[0],
          lastContactDate: new Date().toISOString().split("T")[0],
          notes: "Applied with customized Spring Boot & payment gateway pitch.",
          emailHistory: [
            {
              id: "em-sample-1",
              subject: "Application: Software Engineer - Tatrasi Amar",
              sentAt: new Date().toLocaleString(),
            },
          ],
        },
      ];

      if (supabase) {
        await supabase.from("jobs").insert(
          sampleJobs.map((j) => ({
            id: j.id,
            company: j.company,
            role: j.role,
            contact_name: j.contactName,
            contact_email: j.contactEmail,
            job_url: j.jobUrl,
            location: j.location,
            salary: j.salary,
            status: j.status,
            applied_date: j.appliedDate,
            notes: j.notes,
            email_history: j.emailHistory,
          }))
        );
      } else {
        saveLocalJobs(sampleJobs);
      }
      return NextResponse.json({ success: true, jobs: sampleJobs });
    }

    const body = await request.json();
    const newJob = {
      id: "job-" + Date.now(),
      user_id: body.userId || undefined,
      company: body.company || "Untitled Company",
      role: body.role || "Software Engineer",
      contactName: body.contactName || "",
      contactEmail: body.contactEmail || "",
      jobUrl: body.jobUrl || "",
      location: body.location || "Remote",
      salary: body.salary || "",
      status: body.status || "wishlist",
      appliedDate: body.status === "applied" ? new Date().toISOString().split("T")[0] : "",
      lastContactDate: "",
      notes: body.notes || "",
      emailHistory: body.emailHistory || [],
    };

    if (supabase) {
      const { error } = await supabase.from("jobs").insert({
        id: newJob.id,
        user_id: newJob.user_id,
        company: newJob.company,
        role: newJob.role,
        contact_name: newJob.contactName,
        contact_email: newJob.contactEmail,
        job_url: newJob.jobUrl,
        location: newJob.location,
        salary: newJob.salary,
        status: newJob.status,
        applied_date: newJob.appliedDate,
        last_contact_date: newJob.lastContactDate,
        notes: newJob.notes,
        email_history: newJob.emailHistory,
      });
      if (error) {
        console.error("Supabase insert error:", error);
      }
    }

    const jobs = getLocalJobs();
    jobs.unshift(newJob);
    saveLocalJobs(jobs);

    return NextResponse.json({ success: true, job: newJob });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Job ID required" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (supabase) {
      const updateData: any = {};
      if (body.company !== undefined) updateData.company = body.company;
      if (body.role !== undefined) updateData.role = body.role;
      if (body.contactName !== undefined) updateData.contact_name = body.contactName;
      if (body.contactEmail !== undefined) updateData.contact_email = body.contactEmail;
      if (body.jobUrl !== undefined) updateData.job_url = body.jobUrl;
      if (body.location !== undefined) updateData.location = body.location;
      if (body.salary !== undefined) updateData.salary = body.salary;
      if (body.status !== undefined) updateData.status = body.status;
      if (body.appliedDate !== undefined) updateData.applied_date = body.appliedDate;
      if (body.lastContactDate !== undefined) updateData.last_contact_date = body.lastContactDate;
      if (body.notes !== undefined) updateData.notes = body.notes;
      if (body.emailHistory !== undefined) updateData.email_history = body.emailHistory;

      await supabase.from("jobs").update(updateData).eq("id", body.id);
    }

    const jobs = getLocalJobs();
    const index = jobs.findIndex((j: any) => j.id === body.id);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...body };
      saveLocalJobs(jobs);
      return NextResponse.json({ success: true, job: jobs[index] });
    }

    return NextResponse.json({ success: true, job: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clearAll = searchParams.get("clearAll");
    const userId = searchParams.get("userId");
    const supabase = getSupabase();

    if (clearAll === "true") {
      if (supabase) {
        if (userId) {
          await supabase.from("jobs").delete().eq("user_id", userId);
        } else {
          await supabase.from("jobs").delete().neq("id", "");
        }
      }
      saveLocalJobs([]);
      return NextResponse.json({ success: true, message: "All applications cleared successfully" });
    }

    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Job ID required" }, { status: 400 });
    }

    if (supabase) {
      await supabase.from("jobs").delete().eq("id", id);
    }

    let jobs = getLocalJobs();
    jobs = jobs.filter((j: any) => j.id !== id);
    saveLocalJobs(jobs);

    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
