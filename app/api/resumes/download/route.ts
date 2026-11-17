import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const userId = searchParams.get("userId");

    if (!filename) {
      return new NextResponse("Filename is required", { status: 400 });
    }

    const safeFilename = path.basename(filename);

    // Look for file in user folder, uploads folder, or root
    const possiblePaths = [
      userId ? path.join(process.cwd(), "uploads", userId.replace(/[^a-zA-Z0-9_-]/g, ""), safeFilename) : "",
      path.join(process.cwd(), "uploads", "guest", safeFilename),
      path.join(process.cwd(), "uploads", safeFilename),
      path.join(process.cwd(), safeFilename),
    ].filter(Boolean);

    let foundPath = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      return new NextResponse("Resume file not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const contentType =
      ext === ".pdf"
        ? "application/pdf"
        : ext === ".docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : ext === ".doc"
        ? "application/msword"
        : "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${safeFilename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    return new NextResponse("Error reading resume: " + err.message, { status: 500 });
  }
}
