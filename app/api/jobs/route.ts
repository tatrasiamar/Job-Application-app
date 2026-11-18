import { NextResponse } from "next/server";
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  clearAllJobs,
  seedSampleJobs,
} from "@/services/jobService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const result = await fetchJobs(userId);
  return NextResponse.json({ success: true, jobs: result.jobs, source: result.source });
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "seed") {
      const sampleJobs = await seedSampleJobs();
      return NextResponse.json({ success: true, jobs: sampleJobs });
    }

    const body = await request.json();
    const newJob = await createJob(body);
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

    const updated = await updateJob(body.id, body);
    return NextResponse.json({ success: true, job: updated || body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clearAll = searchParams.get("clearAll");
    const userId = searchParams.get("userId");

    if (clearAll === "true") {
      await clearAllJobs(userId);
      return NextResponse.json({ success: true, message: "All applications cleared successfully" });
    }

    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Job ID required" }, { status: 400 });
    }

    await deleteJob(id);
    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
