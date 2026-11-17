import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

interface ResumeRecord {
  id: string;
  userId?: string;
  fileName: string;
  filePath: string;
  fileSizeKb: number;
  isDefault: boolean;
  uploadedAt: string;
  downloadUrl: string;
}

const REGISTRY_FILE = path.join(process.cwd(), "data", "resumes.json");

function getLocalRegistry(): ResumeRecord[] {
  if (fs.existsSync(REGISTRY_FILE)) {
    try {
      const raw = fs.readFileSync(REGISTRY_FILE, "utf-8").replace(/^\uFEFF/, "");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading resumes registry:", e);
    }
  }

  // Seed default resume if none exists
  const defaultPath = path.join(process.cwd(), "Tatrasi_Amar_Resume.pdf");
  const initial: ResumeRecord[] = [];
  if (fs.existsSync(defaultPath)) {
    const stats = fs.statSync(defaultPath);
    initial.push({
      id: "res-default",
      fileName: "Tatrasi_Amar_Resume.pdf",
      filePath: defaultPath,
      fileSizeKb: Math.round(stats.size / 1024),
      isDefault: true,
      uploadedAt: stats.mtime.toISOString().split("T")[0],
      downloadUrl: "/api/resumes/download?filename=Tatrasi_Amar_Resume.pdf",
    });
  }
  return initial;
}

function saveLocalRegistry(records: ResumeRecord[]) {
  fs.mkdirSync(path.dirname(REGISTRY_FILE), { recursive: true });
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(records, null, 2), "utf-8");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .or(`user_id.eq.${userId},user_id.is.null`)
          .order("uploaded_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped: ResumeRecord[] = data.map((item) => ({
            id: item.id,
            userId: item.user_id,
            fileName: item.file_name,
            filePath: item.file_path,
            fileSizeKb: item.file_size_kb || 0,
            isDefault: !!item.is_default,
            uploadedAt: item.uploaded_at ? item.uploaded_at.split("T")[0] : "Recent",
            downloadUrl: `/api/resumes/download?filename=${encodeURIComponent(item.file_name)}${userId ? `&userId=${userId}` : ""}`,
          }));
          return NextResponse.json({ success: true, resumes: mapped, source: "supabase" });
        }
      } catch (err) {
        console.warn("Supabase resumes fetch fallback to local:", err);
      }
    }

    const registry = getLocalRegistry();
    const filtered = userId
      ? registry.filter((r) => !r.userId || r.userId === userId)
      : registry;

    return NextResponse.json({ success: true, resumes: filtered, source: "local" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = (formData.get("userId") as string) || undefined;
    const isDefaultParam = formData.get("isDefault") === "true";

    if (!file) {
      return NextResponse.json({ success: false, error: "No resume file provided." }, { status: 400 });
    }

    // Prepare upload directory scoped by userId
    const safeUserFolder = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, "") : "guest";
    const uploadDir = path.join(process.cwd(), "uploads", safeUserFolder);
    fs.mkdirSync(uploadDir, { recursive: true });

    // Clean file name
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const targetPath = path.join(uploadDir, safeFilename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(targetPath, buffer);

    const sizeKb = Math.round(buffer.length / 1024);
    const resumeId = "res-" + Date.now();
    const uploadedAt = new Date().toISOString().split("T")[0];

    const newResume: ResumeRecord = {
      id: resumeId,
      userId,
      fileName: safeFilename,
      filePath: targetPath,
      fileSizeKb: sizeKb,
      isDefault: isDefaultParam,
      uploadedAt,
      downloadUrl: `/api/resumes/download?filename=${encodeURIComponent(safeFilename)}${userId ? `&userId=${userId}` : ""}`,
    };

    // Update Local Registry
    const registry = getLocalRegistry();
    if (isDefaultParam) {
      registry.forEach((r) => {
        if (!userId || r.userId === userId) r.isDefault = false;
      });
    }
    // If first resume, make default
    if (registry.length === 0) {
      newResume.isDefault = true;
    }
    registry.unshift(newResume);
    saveLocalRegistry(registry);

    // Sync to Supabase if configured
    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        if (isDefaultParam) {
          await supabase.from("resumes").update({ is_default: false }).eq("user_id", userId);
        }
        await supabase.from("resumes").insert({
          id: resumeId,
          user_id: userId,
          file_name: safeFilename,
          file_path: targetPath,
          file_size_kb: sizeKb,
          is_default: newResume.isDefault,
          uploaded_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase resume insert warning:", err);
      }
    }

    return NextResponse.json({ success: true, resume: newResume });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const filename = searchParams.get("filename");
    const userId = searchParams.get("userId");

    if (!id && !filename) {
      return NextResponse.json({ success: false, error: "Resume ID or filename required." }, { status: 400 });
    }

    const registry = getLocalRegistry();
    const foundIndex = registry.findIndex(
      (r) => (id && r.id === id) || (filename && r.fileName === filename)
    );

    if (foundIndex !== -1) {
      const removed = registry[foundIndex];
      // Try to remove from disk if inside uploads
      if (removed.filePath && fs.existsSync(removed.filePath) && removed.filePath.includes("uploads")) {
        try {
          fs.unlinkSync(removed.filePath);
        } catch (e) {}
      }
      registry.splice(foundIndex, 1);
      // Ensure at least one default remains
      if (removed.isDefault && registry.length > 0) {
        registry[0].isDefault = true;
      }
      saveLocalRegistry(registry);
    }

    const supabase = getSupabase();
    if (supabase && id) {
      try {
        await supabase.from("resumes").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase resume delete error:", e);
      }
    }

    return NextResponse.json({ success: true, message: "Resume removed successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isDefault, userId } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Resume ID required." }, { status: 400 });
    }

    const registry = getLocalRegistry();
    registry.forEach((r) => {
      if (!userId || r.userId === userId) {
        r.isDefault = r.id === id ? !!isDefault : false;
      }
    });
    saveLocalRegistry(registry);

    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        await supabase.from("resumes").update({ is_default: false }).eq("user_id", userId);
        await supabase.from("resumes").update({ is_default: !!isDefault }).eq("id", id);
      } catch (e) {
        console.warn("Supabase resume patch error:", e);
      }
    }

    return NextResponse.json({ success: true, message: "Default resume updated." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
