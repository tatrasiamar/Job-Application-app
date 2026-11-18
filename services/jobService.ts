import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";
import { JobApplication, JobStatus } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data", "jobs.json");

export function getLocalJobs(): JobApplication[] {
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

export function saveLocalJobs(jobs: JobApplication[]): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2), "utf-8");
}

export async function fetchJobs(userId?: string | null): Promise<{ jobs: JobApplication[]; source: "supabase" | "local" }> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      let query = supabase.from("jobs").select("*");
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped: JobApplication[] = data.map((j: any) => ({
          id: j.id,
          company: j.company,
          role: j.role,
          contactName: j.contact_name,
          contactEmail: j.contact_email,
          jobUrl: j.job_url,
          location: j.location,
          salary: j.salary,
          status: j.status as JobStatus,
          appliedDate: j.applied_date,
          lastContactDate: j.last_contact_date,
          notes: j.notes,
          emailHistory: j.email_history || [],
        }));
        return { jobs: mapped, source: "supabase" };
      }
    } catch (err) {
      console.warn("Supabase GET jobs fallback to local:", err);
    }
  }

  const jobs = getLocalJobs();
  return { jobs, source: "local" };
}

export async function createJob(body: any): Promise<JobApplication> {
  const supabase = getSupabase();
  const newJob: JobApplication & { user_id?: string } = {
    id: "job-" + Date.now(),
    user_id: body.userId || undefined,
    company: body.company || "Untitled Company",
    role: body.role || "Software Engineer",
    contactName: body.contactName || "",
    contactEmail: body.contactEmail || "",
    jobUrl: body.jobUrl || "",
    location: body.location || "Remote",
    salary: body.salary || "",
    status: (body.status || "wishlist") as JobStatus,
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

  return newJob;
}

export async function updateJob(id: string, updates: Partial<JobApplication>): Promise<JobApplication | null> {
  const supabase = getSupabase();

  if (supabase) {
    const updateData: any = {};
    if (updates.company !== undefined) updateData.company = updates.company;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.contactName !== undefined) updateData.contact_name = updates.contactName;
    if (updates.contactEmail !== undefined) updateData.contact_email = updates.contactEmail;
    if (updates.jobUrl !== undefined) updateData.job_url = updates.jobUrl;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.salary !== undefined) updateData.salary = updates.salary;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.appliedDate !== undefined) updateData.applied_date = updates.appliedDate;
    if (updates.lastContactDate !== undefined) updateData.last_contact_date = updates.lastContactDate;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.emailHistory !== undefined) updateData.email_history = updates.emailHistory;

    await supabase.from("jobs").update(updateData).eq("id", id);
  }

  const jobs = getLocalJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates };
    saveLocalJobs(jobs);
    return jobs[index];
  }

  return null;
}

export async function deleteJob(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("jobs").delete().eq("id", id);
  }

  let jobs = getLocalJobs();
  jobs = jobs.filter((j) => j.id !== id);
  saveLocalJobs(jobs);
}

export async function clearAllJobs(userId?: string | null): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    if (userId) {
      await supabase.from("jobs").delete().eq("user_id", userId);
    } else {
      await supabase.from("jobs").delete().neq("id", "");
    }
  }
  saveLocalJobs([]);
}

export async function seedSampleJobs(): Promise<JobApplication[]> {
  const sampleJobs: JobApplication[] = [
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

  const supabase = getSupabase();
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

  return sampleJobs;
}
