import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export async function GET() {
  const files: Array<{ filename: string; path: string; sizeKb: number; uploadedAt: string }> = [];

  // Check default resume
  const defaultResume = path.join(process.cwd(), "Tatrasi_Amar_Resume.pdf");
  if (fs.existsSync(defaultResume)) {
    const stats = fs.statSync(defaultResume);
    files.push({
      filename: "Tatrasi_Amar_Resume.pdf",
      path: defaultResume,
      sizeKb: Math.round(stats.size / 1024),
      uploadedAt: stats.mtime.toISOString().split("T")[0],
    });
  }

  // Check uploads folder
  if (fs.existsSync(UPLOADS_DIR)) {
    const dirFiles = fs.readdirSync(UPLOADS_DIR);
    for (const f of dirFiles) {
      const fullPath = path.join(UPLOADS_DIR, f);
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        files.push({
          filename: f,
          path: fullPath,
          sizeKb: Math.round(stats.size / 1024),
          uploadedAt: stats.mtime.toISOString().split("T")[0],
        });
      }
    }
  }

  return NextResponse.json({ success: true, files });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(UPLOADS_DIR, file.name);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      file: {
        filename: file.name,
        path: filePath,
        sizeKb: Math.round(buffer.length / 1024),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

