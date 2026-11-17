import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

const TEMPLATES_FILE = path.join(process.cwd(), "data", "templates.json");

function getLocalTemplates() {
  if (!fs.existsSync(TEMPLATES_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(TEMPLATES_FILE, "utf-8").replace(/^\uFEFF/, "");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading templates.json:", err);
    return [];
  }
}

function saveLocalTemplates(templates: any[]) {
  fs.mkdirSync(path.dirname(TEMPLATES_FILE), { recursive: true });
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2), "utf-8");
}

export async function GET() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("email_templates").select("*").order("created_at", { ascending: true });
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, templates: data, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase GET templates fallback to local:", err);
    }
  }

  const templates = getLocalTemplates();
  return NextResponse.json({ success: true, templates, source: "local" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTemplate = {
      id: "tpl-" + Date.now(),
      name: body.name || "Custom Template",
      category: body.category || "General",
      subject: body.subject || "",
      body: body.body || "",
    };

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from("email_templates").insert(newTemplate);
    }

    const templates = getLocalTemplates();
    templates.push(newTemplate);
    saveLocalTemplates(templates);

    return NextResponse.json({ success: true, template: newTemplate });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Template ID is required" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from("email_templates").update({
        name: body.name,
        category: body.category,
        subject: body.subject,
        body: body.body,
      }).eq("id", body.id);
    }

    const templates = getLocalTemplates();
    const idx = templates.findIndex((t: any) => t.id === body.id);
    if (idx !== -1) {
      templates[idx] = { ...templates[idx], ...body };
      saveLocalTemplates(templates);
      return NextResponse.json({ success: true, template: templates[idx] });
    }

    return NextResponse.json({ success: true, template: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Template ID is required" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from("email_templates").delete().eq("id", id);
    }

    let templates = getLocalTemplates();
    templates = templates.filter((t: any) => t.id !== id);
    saveLocalTemplates(templates);

    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
