import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, url } = await request.json();

    if (!text && !url) {
      return NextResponse.json(
        { success: false, error: "Please provide a job posting text or URL." },
        { status: 400 }
      );
    }

    let rawText = text || "";

    // If a URL was provided, attempt to fetch its basic text
    if (url && !text) {
      try {
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const html = await res.text();
          // Strip HTML tags for simple parsing
          rawText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
                        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
                        .replace(/<[^>]+>/g, " ")
                        .replace(/\s+/g, " ")
                        .slice(0, 4000);
        }
      } catch (e) {
        console.warn("Could not fetch URL directly, parsing from URL string:", e);
      }
    }

    // Dynamic heuristic parser
    const lines = rawText.split("\n").map((l: string) => l.trim()).filter(Boolean);

    // Heuristics for company
    let company = "Target Company";
    if (url) {
      try {
        const hostname = new URL(url).hostname.replace("www.", "").split(".")[0];
        if (hostname && !["linkedin", "indeed", "naukri", "glassdoor"].includes(hostname)) {
          company = hostname.charAt(0).toUpperCase() + hostname.slice(1);
        }
      } catch (e) {}
    }

    // Look for company keywords in text
    const companyMatch = rawText.match(/(?:at|company|about|join)\s+([A-Z][A-Za-z0-9&.\s]{2,25})/i);
    if (companyMatch && companyMatch[1]) {
      company = companyMatch[1].trim();
    }

    // Heuristics for role
    let role = "Software Engineer";
    const roleMatch = rawText.match(/(?:hiring for|position:|role:|job title:?)\s*([A-Za-z0-9\s\-\/\(\)]+)/i) ||
                      rawText.match(/(Full[\s\-]Stack Engineer|Software Engineer|Backend Engineer|Frontend Engineer|Java Developer|React Developer|SDE[\s\-]?[123])/i);
    if (roleMatch && roleMatch[1]) {
      role = roleMatch[1].trim().slice(0, 50);
    }

    // Heuristics for location
    let location = "Remote";
    const locMatch = rawText.match(/(?:location|based in|workplace):?\s*([A-Za-z\s,]+)/i) ||
                     rawText.match(/(Hyderabad|Bengaluru|Bangalore|Pune|Mumbai|Delhi|Remote|Hybrid)/i);
    if (locMatch && locMatch[1]) {
      location = locMatch[1].trim().slice(0, 30);
    }

    // Heuristics for salary
    let salary = "";
    const salMatch = rawText.match(/(?:salary|compensation|ctc|package):?\s*([₹$€£0-9\s\-–toLPAkK]+)/i) ||
                     rawText.match(/(₹?\s*[0-9]+(?:\.[0-9]+)?\s*[-–to]+\s*[0-9]+(?:\.[0-9]+)?\s*(?:LPA|lpa|Cr|k|K))/);
    if (salMatch && salMatch[1]) {
      salary = salMatch[1].trim().slice(0, 25);
    }

    // Heuristics for contact email
    let contactEmail = "";
    const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
    if (emailMatch && emailMatch[1]) {
      contactEmail = emailMatch[1].trim();
    }

    // Heuristics for contact name
    let contactName = "";
    const nameMatch = rawText.match(/(?:contact|recruiter|posted by|hiring manager):?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (nameMatch && nameMatch[1]) {
      contactName = nameMatch[1].trim();
    }

    return NextResponse.json({
      success: true,
      extracted: {
        company,
        role,
        location,
        salary,
        contactEmail,
        contactName,
        jobUrl: url || "",
        notes: rawText.slice(0, 300) + (rawText.length > 300 ? "..." : ""),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

