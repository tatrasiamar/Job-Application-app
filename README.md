# JobFlow AI — 100% Dynamic Job Outreach & Tracking Platform

A complete Next.js full-stack system where **every single component is dynamic, editable from the browser, and persistently saved to disk**.

---

## 🚀 What Makes It 100% Dynamic

| Component | Static (Before) | Dynamic (Now) |
| :--- | :--- | :--- |
| **Candidate Profile** | Hardcoded in scripts | Editable in the UI (**Candidate Profile** tab), saved in `data/profile.json` |
| **Email Templates** | Hardcoded text in files | Full **Dynamic Template Manager** with variable tags (`{{company}}`, `{{role}}`, `{{candidate_name}}`), saved in `data/templates.json` |
| **Resume & Attachments** | Fixed file path | Live **File Uploader** (`/api/upload`) allowing you to upload and select *any* resume or portfolio |
| **Job Pipeline** | Hardcoded list | Dynamic CRUD system (Add, Edit, Delete, Filter, Search, Stage change) saved in `data/jobs.json` |
| **SMTP Relay Credentials** | Hardcoded in `.env` | Editable in the UI (**SMTP Settings** tab) with instant verification, saved in `data/settings.json` |

---

## 🛠️ Dynamic Variable Engine

When writing or applying cold email templates, you can use any of these dynamic tags:

- `{{company}}` — Target Company Name
- `{{role}}` — Target Job Role Title
- `{{recruiter_name}}` — Recruiter / Hiring Manager Name
- `{{candidate_name}}` — Your Name from your Dynamic Profile
- `{{candidate_title}}` — Your Professional Title
- `{{candidate_skills}}` — Your Technical Stack
- `{{candidate_experience}}` — Years of Experience
- `{{candidate_notice}}` — Notice Period (e.g., *Immediate Joiner*)
- `{{candidate_phone}}` — Your Phone Number
- `{{candidate_email}}` — Your Email Address
- `{{candidate_linkedin}}` — Your LinkedIn URL
- `{{candidate_github}}` — Your GitHub URL

---

## 🌐 Live Application

Open **[http://localhost:3000](http://localhost:3000)** in your browser.
