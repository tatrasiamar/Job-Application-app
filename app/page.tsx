"use client";



import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {

  Briefcase,

  Send,

  Mail,

  CheckCircle2,

  AlertCircle,

  FileText,

  Clock,

  Settings,

  RefreshCw,

  Sparkles,

  ShieldCheck,

  Server,

  User,

  Paperclip,

  ExternalLink,

  Plus,

  Trash2,

  Edit3,

  Calendar,

  Building,

  MapPin,

  DollarSign,

  TrendingUp,

  Search,

  Upload,

  Layers,

  Code,

  X,

  Sliders,

  Check,

  Zap,

  LayoutGrid,

  Columns,

  ArrowRight,

  RotateCcw,

  Globe,

  Compass,

  Tag,

  ChevronRight,

  BookmarkPlus,

  LogIn,

  LogOut,

  Lock,

  UserCheck,
  Key,

} from "lucide-react";



interface EmailHistory {

  id: string;

  subject: string;

  sentAt: string;

}



interface JobApplication {

  id: string;

  company: string;

  role: string;

  contactName: string;

  contactEmail: string;

  jobUrl?: string;

  location?: string;

  salary?: string;

  status: "wishlist" | "applied" | "interviewing" | "offer" | "rejected";

  appliedDate?: string;

  lastContactDate?: string;

  notes?: string;

  emailHistory?: EmailHistory[];

}



interface DiscoveredJob {

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



interface AppSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpKey: string;
  senderEmail: string;
  senderName: string;
  replyToEmail: string;
  replyToName: string;
  coldMailProvider: string;
  coldMailApiKey: string;
  jobSearchProvider: string;
  rapidapiKey: string;
  adzunaAppId: string;
  adzunaAppKey: string;
  serpapiKey: string;
  customJobSearchUrl: string;
}

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

interface CandidateProfile {

  name: string;

  title: string;

  email: string;

  phone: string;

  experience: string;

  skills: string;

  noticePeriod: string;

  location: string;

  portfolioUrl?: string;

  linkedinUrl?: string;

  githubUrl?: string;

  bio?: string;

}



interface EmailTemplate {

  id: string;

  name: string;

  category: string;

  subject: string;

  body: string;

}



interface UploadedFile {

  filename: string;

  path: string;

  sizeKb: number;

  uploadedAt: string;

}



export default function Home() {

  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"tracker" | "discover" | "outreach" | "templates" | "profile" | "settings">("tracker");

  const [viewMode, setViewMode] = useState<"grid" | "kanban">("grid");



  // Supabase Auth State

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [authReady, setAuthReady] = useState(false);



  // Dynamic Data States

  const [jobs, setJobs] = useState<JobApplication[]>([]);

  const [profile, setProfile] = useState<CandidateProfile>({

    name: "Tatrasi Amar",

    title: "Full-Stack Software Engineer (Java • Spring Boot • React • Next.js)",

    email: "tatrasiamar123@gmail.com",

    phone: "+91 7330807277",

    experience: "2 years",

    skills: "Java, React, Next.js",

    noticePeriod: "Immediate",

    location: "Remote",

  });

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<"profile" | "resumes">("profile");
  const [settingsSubTab, setSettingsSubTab] = useState<"mailing" | "jobsearch" | "security">("mailing");

  // Account Security & Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [selectedAttachment, setSelectedAttachment] = useState<string>("Tatrasi_Amar_Resume.pdf");



  // Search & Filter

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("all");



  // Discover Live Jobs States

  const [discoverQuery, setDiscoverQuery] = useState("Software Engineer");

  const [discoveredJobs, setDiscoveredJobs] = useState<DiscoveredJob[]>([]);

  const [isSearchingJobs, setIsSearchingJobs] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);



  // Job Modal State

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  const [jobForm, setJobForm] = useState({

    company: "",

    role: "",

    contactName: "",

    contactEmail: "",

    jobUrl: "",

    location: "Remote",

    salary: "",

    status: "wishlist" as JobApplication["status"],

    notes: "",

  });



  // Smart Parser / Import Modal State

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [importText, setImportText] = useState("");

  const [importUrl, setImportUrl] = useState("");

  const [isParsing, setIsParsing] = useState(false);

  const [parseError, setParseError] = useState("");



  // Template Modal State

  const [isTplModalOpen, setIsTplModalOpen] = useState(false);

  const [editingTpl, setEditingTpl] = useState<EmailTemplate | null>(null);

  const [tplForm, setTplForm] = useState({

    name: "",

    category: "General",

    subject: "",

    body: "",

  });



  // Cold Email Composer State

  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const [recipient, setRecipient] = useState("");

  const [recipientName, setRecipientName] = useState("");

  const [companyName, setCompanyName] = useState("");

  const [roleTitle, setRoleTitle] = useState("");

  const [subject, setSubject] = useState("");

  const [body, setBody] = useState("");

  const [attachResume, setAttachResume] = useState(true);

  const [isSending, setIsSending] = useState(false);

  const [sendResult, setSendResult] = useState<{ type: "success" | "error"; message: string } | null>(null);



  // SMTP Settings State

  const [settings, setSettings] = useState<AppSettings>({
    smtpHost: "smtp-relay.brevo.com",
    smtpPort: "587",
    smtpUser: "c2812c001@smtp-brevo.com",
    smtpKey: "",
    senderEmail: "tatrasiamar123@gmail.com",
    senderName: "Tatrasi Amar",
    replyToEmail: "tatrasiamar123@gmail.com",
    replyToName: "Tatrasi Amar",
    coldMailProvider: "smtp",
    coldMailApiKey: "",
    jobSearchProvider: "open_apis",
    rapidapiKey: "",
    adzunaAppId: "",
    adzunaAppKey: "",
    serpapiKey: "",
    customJobSearchUrl: "",
  });

  const [settingsSaved, setSettingsSaved] = useState(false);



  // Connection diagnostics

  const [isCheckingConn, setIsCheckingConn] = useState(false);

  const [connStatus, setConnStatus] = useState<{

    connected: boolean;

    latencyMs?: number;

    message?: string;

    error?: string;

  } | null>(null);



  // Uploading state

  const [isUploading, setIsUploading] = useState(false);



  // Toast feedback

  const [toastMessage, setToastMessage] = useState<string | null>(null);



  const showToast = (msg: string) => {

    setToastMessage(msg);

    setTimeout(() => setToastMessage(null), 3500);

  };



  // Listen to Supabase auth state change

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {

      if (session?.user) {

        setCurrentUser(session.user);

        fetchAllData(session.user.id);

      } else {

        router.replace("/login");

      }

      setAuthReady(true);

    });



    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {

      const u = session?.user ?? null;

      setCurrentUser(u);

      if (u) {

        fetchAllData(u.id);

      }

    });



    return () => subscription.unsubscribe();

  }, []);





  const fetchAllData = async (uid?: string) => {

    const currentUid = uid || currentUser?.id;

    const queryParam = currentUid ? `?userId=${currentUid}` : "";

    try {

      const [resJobs, resProfile, resTemplates, resFiles, resSettings] = await Promise.all([

        fetch(`/api/jobs${queryParam}`).then((r) => r.json()),

        fetch(`/api/profile${queryParam}`).then((r) => r.json()),

        fetch(`/api/templates${queryParam}`).then((r) => r.json()),

        fetch("/api/upload").then((r) => r.json()),

        fetch(`/api/settings${queryParam}`).then((r) => r.json()),

      ]);



      if (resJobs.success) setJobs(resJobs.jobs);

      if (resProfile.success && resProfile.profile) {

        setProfile(resProfile.profile);

        if (resProfile.profile.title) {

          setDiscoverQuery(resProfile.profile.title.split("(")[0].trim() || "Software Engineer");

        }

      }

      if (resTemplates.success && Array.isArray(resTemplates.templates)) {

        setTemplates(resTemplates.templates);

        if (resTemplates.templates.length > 0) {

          setSelectedTemplateId(resTemplates.templates[0].id);

        }

      }

      if (resFiles.success && Array.isArray(resFiles.files)) {

        setUploadedFiles(resFiles.files);

        if (resFiles.files.length > 0) {

          setSelectedAttachment(resFiles.files[0].filename);

        }

      }

      if (resSettings.success && resSettings.settings) {

        setSettings(resSettings.settings);

      }

      checkConnection();

    } catch (err) {

      console.error("Error loading application data:", err);

    }

  };



  const checkConnection = async () => {

    setIsCheckingConn(true);

    try {

      const res = await fetch("/api/verify", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          host: settings.smtpHost,

          port: settings.smtpPort,

          user: settings.smtpUser,

          key: settings.smtpKey,

        }),

      });

      const data = await res.json();

      if (data.success) {

        setConnStatus({ connected: true, latencyMs: data.latencyMs, message: data.message });

      } else {

        setConnStatus({ connected: false, error: data.error });

      }

    } catch (err: any) {

      setConnStatus({ connected: false, error: err.message || "Connection test failed" });

    } finally {

      setIsCheckingConn(false);

    }

  };



  const handleSignOut = async () => {

    await supabase.auth.signOut();

    setCurrentUser(null);

    router.replace("/login");

  };



  // Dynamic Live Job Search

  const handleSearchLiveJobs = async (customQ?: string) => {

    const q = customQ || discoverQuery;

    if (!q.trim()) return;



    setIsSearchingJobs(true);

    setHasSearched(true);

    try {

      const res = await fetch(`/api/jobs/search?query=${encodeURIComponent(q)}`);

      const data = await res.json();

      if (data.success && Array.isArray(data.jobs)) {

        setDiscoveredJobs(data.jobs);

      }

    } catch (err) {

      console.error("Failed to search live jobs:", err);

    } finally {

      setIsSearchingJobs(false);

    }

  };



  // Track Discovered Job

  const handleTrackDiscoveredJob = async (dj: DiscoveredJob) => {

    try {

      const res = await fetch("/api/jobs", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          company: dj.company,

          role: dj.role,

          location: dj.location,

          salary: dj.salary,

          jobUrl: dj.url,

          status: "wishlist",

          userId: currentUser?.id,

          notes: `Discovered from live job feed (${dj.source}). Tags: ${dj.tags.join(", ")}`,

        }),

      });

      const data = await res.json();

      if (data.success) {

        setJobs((prev) => [data.job, ...prev]);

        showToast(`Added ${dj.company} (${dj.role}) to your tracker!`);

      }

    } catch (err) {

      console.error("Failed to track job:", err);

    }

  };



  // Pitch Discovered Job with Cold Email

  const handlePitchDiscoveredJob = (dj: DiscoveredJob) => {

    setCompanyName(dj.company);

    setRoleTitle(dj.role);

    setRecipient("");

    setRecipientName("Hiring Team");



    const preferredTpl = selectedTemplateId || templates[0]?.id;

    if (preferredTpl) {

      applyTemplate(preferredTpl, dj.company, dj.role, "Hiring Team");

    }



    setActiveTab("outreach");

    window.scrollTo({ top: 0, behavior: "smooth" });

    showToast(`Drafting cold outreach for ${dj.company}...`);

  };



  // Dynamic Variable Interpolation

  const interpolate = (templateStr: string, comp = companyName, role = roleTitle, recName = recipientName) => {

    if (!templateStr) return "";

    return templateStr

      .replace(/{{candidate_name}}/g, profile.name || "Candidate")

      .replace(/{{candidate_title}}/g, profile.title || "Software Engineer")

      .replace(/{{candidate_skills}}/g, profile.skills || "")

      .replace(/{{candidate_skills_short}}/g, (profile.skills || "").split(",").slice(0, 3).join(", "))

      .replace(/{{candidate_experience}}/g, profile.experience || "2 years")

      .replace(/{{candidate_notice}}/g, profile.noticePeriod || "Immediate Joiner")

      .replace(/{{candidate_phone}}/g, profile.phone || "")

      .replace(/{{candidate_email}}/g, profile.email || "")

      .replace(/{{candidate_linkedin}}/g, profile.linkedinUrl || "")

      .replace(/{{candidate_github}}/g, profile.githubUrl || "")

      .replace(/{{company}}/g, comp || "your company")

      .replace(/{{role}}/g, role || "Software Engineer")

      .replace(/{{recruiter_name}}/g, recName || "Hiring Team");

  };



  // Switch or apply template dynamically

  const applyTemplate = (tplId: string, comp = companyName, role = roleTitle, recName = recipientName) => {

    const tpl = templates.find((t) => t.id === tplId);

    if (!tpl) return;

    setSelectedTemplateId(tplId);

    setSubject(interpolate(tpl.subject, comp, role, recName));

    setBody(interpolate(tpl.body, comp, role, recName));

  };



  // Select job for outreach

  const handleSelectJobForOutreach = (job: JobApplication) => {

    setSelectedJobId(job.id);

    setCompanyName(job.company);

    setRoleTitle(job.role);

    setRecipient(job.contactEmail || "");

    setRecipientName(job.contactName || "Hiring Manager");



    const preferredTpl = job.status === "applied" ? "tpl-followup" : selectedTemplateId || templates[0]?.id;

    applyTemplate(preferredTpl, job.company, job.role, job.contactName || "Hiring Manager");



    setActiveTab("outreach");

    window.scrollTo({ top: 0, behavior: "smooth" });

  };



  // Send Email Handler

  const handleSendEmail = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!recipient.trim()) return;



    setIsSending(true);

    setSendResult(null);



    const chosenFile: any = resumes.find((r) => r.fileName === selectedAttachment) || uploadedFiles.find((f) => f.filename === selectedAttachment);



    const htmlContent = `

      <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6; max-width: 620px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">

        <h3 style="color: #0b66c2; margin-top: 0;">${profile.name}</h3>

        <p style="color: #666; font-size: 13px; margin-top: -10px;">${profile.title}</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">

        <div style="white-space: pre-line; font-size: 14px;">${body}</div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0 15px 0;">

        <p style="font-size: 12px; color: #888; margin: 0;">

          ${attachResume && chosenFile ? `Attached: <strong>${chosenFile.filename}</strong> | ` : ""}${profile.noticePeriod} | ${profile.phone}

        </p>

      </div>

    `;



    try {

      const res = await fetch("/api/send", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          to: recipient,

          subject,

          body,

          html: htmlContent,

          attachResume,

          attachmentPath: chosenFile?.path,

          attachmentFilename: chosenFile?.filename,

          senderName: profile.name || settings.senderName,

          senderEmail: settings.senderEmail,

          replyToEmail: settings.replyToEmail || profile.email || settings.senderEmail,

          replyToName: settings.replyToName || profile.name || settings.senderName,

          smtpHost: settings.smtpHost,

          smtpPort: settings.smtpPort,

          smtpUser: settings.smtpUser,

          smtpKey: settings.smtpKey,

          jobId: selectedJobId || undefined,

        }),

      });



      const data = await res.json();

      if (data.success) {

        setSendResult({

          type: "success",

          message: data.message || `Cold email successfully sent to ${recipient}!`,

        });

        const freshJobs = await fetch("/api/jobs").then((r) => r.json());

        if (freshJobs.success) setJobs(freshJobs.jobs);

        showToast("Email sent and recorded to job history!");

      } else {

        setSendResult({ type: "error", message: data.error || "Failed to dispatch email." });

      }

    } catch (err: any) {

      setSendResult({ type: "error", message: err.message || "Network error while sending email." });

    } finally {

      setIsSending(false);

    }

  };



  // Upload handler

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    const formData = new FormData();

    formData.append("file", file);



    setIsUploading(true);

    try {

      const res = await fetch("/api/upload", { method: "POST", body: formData });

      const data = await res.json();

      if (data.success) {

        const fresh = await fetch("/api/upload").then((r) => r.json());

        if (fresh.success) {

          setUploadedFiles(fresh.files);

          setSelectedAttachment(data.file.filename);

          showToast(`Uploaded ${data.file.filename}`);

        }

      }

    } catch (err) {

      console.error("Upload error:", err);

    } finally {

      setIsUploading(false);

    }

  };



  // Save Profile Handler

    // Resume Management Handlers
  const handleUploadResumeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append("file", file);
    if (currentUser?.id) {
      formData.append("userId", currentUser.id);
    }
    if (resumes.length === 0) {
      formData.append("isDefault", "true");
    }

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.resume) {
        setResumes((prev) => [data.resume, ...prev.filter((r) => r.id !== data.resume.id)]);
        setSelectedAttachment(data.resume.fileName);
        showToast(`Resume "${file.name}" uploaded successfully!`);
      } else {
        showToast(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      showToast("Failed to upload resume.");
    } finally {
      setIsUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleSetDefaultResume = async (resumeId: string) => {
    try {
      const res = await fetch("/api/resumes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resumeId, isDefault: true, userId: currentUser?.id }),
      });
      const data = await res.json();
      if (data.success) {
        setResumes((prev) =>
          prev.map((r) => ({
            ...r,
            isDefault: r.id === resumeId,
          }))
        );
        const target = resumes.find((r) => r.id === resumeId);
        if (target) {
          setSelectedAttachment(target.fileName);
          showToast(`Default active resume set to: ${target.fileName}`);
        }
      }
    } catch (err) {
      console.error("Set default resume error:", err);
    }
  };

  const handleDeleteResume = async (resumeId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
    try {
      const res = await fetch(`/api/resumes?id=${resumeId}&filename=${encodeURIComponent(filename)}${currentUser?.id ? `&userId=${currentUser.id}` : ""}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setResumes((prev) => prev.filter((r) => r.id !== resumeId));
        showToast(`Deleted resume: ${filename}`);
        if (selectedAttachment === filename) {
          setSelectedAttachment(resumes.find((r) => r.id !== resumeId)?.fileName || "");
        }
      }
    } catch (err) {
      console.error("Delete resume error:", err);
    }
  };

  // Account Security Handlers
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus({ type: "error", message: "Password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    setIsUpdatingPassword(true);
    setPasswordStatus(null);
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordStatus({ type: "success", message: "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
      showToast("Account password updated!");
    } catch (err: any) {
      setPasswordStatus({ type: "error", message: err.message || "Failed to update password." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayNameInput.trim()) return;
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayNameInput.trim() },
      });
      if (error) throw error;
      showToast("Display name updated!");
      setProfile((prev) => ({ ...prev, name: displayNameInput.trim() }));
    } catch (err: any) {
      showToast(err.message || "Failed to update name.");
    }
  };

const handleSaveProfile = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      const res = await fetch("/api/profile", {

        method: "PUT",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(profile),

      });

      const data = await res.json();

      if (data.success) {

        showToast("Candidate profile saved dynamically!");

        if (selectedTemplateId) {

          applyTemplate(selectedTemplateId);

        }

      }

    } catch (err) {

      console.error("Profile save error:", err);

    }

  };



  // Save Settings Handler

  const handleSaveSettings = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      const res = await fetch("/api/settings", {

        method: "PUT",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(settings),

      });

      const data = await res.json();

      if (data.success) {

        setSettingsSaved(true);

        showToast("SMTP configuration saved!");

        setTimeout(() => setSettingsSaved(false), 3000);

        checkConnection();

      }

    } catch (err) {

      console.error("Settings save error:", err);

    }

  };



  // Smart Parse Job Handler

  const handleParseJob = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!importText && !importUrl) return;



    setIsParsing(true);

    setParseError("");



    try {

      const res = await fetch("/api/jobs/parse", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ text: importText, url: importUrl }),

      });

      const data = await res.json();



      if (data.success && data.extracted) {

        const saveRes = await fetch("/api/jobs", {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({

            ...data.extracted,

            status: "wishlist",

          }),

        });

        const saveData = await saveRes.json();

        if (saveData.success) {

          setJobs((prev) => [saveData.job, ...prev]);

          setIsImportModalOpen(false);

          setImportText("");

          setImportUrl("");

          showToast(`Successfully extracted ${saveData.job.company}!`);

        }

      } else {

        setParseError(data.error || "Failed to extract job details.");

      }

    } catch (err: any) {

      setParseError(err.message || "Extraction error.");

    } finally {

      setIsParsing(false);

    }

  };



  // Clear All Jobs Handler

  const handleClearAllJobs = async () => {

    if (!confirm("Are you sure you want to clear all applications? This will empty your tracker so you can work exclusively with your real data.")) {

      return;

    }

    try {

      const res = await fetch("/api/jobs?clearAll=true", { method: "DELETE" });

      const data = await res.json();

      if (data.success) {

        setJobs([]);

        showToast("All applications cleared.");

      }

    } catch (err) {

      console.error("Clear error:", err);

    }

  };



  // Seed Sample Jobs Handler

  const handleSeedSampleJobs = async () => {

    try {

      const res = await fetch("/api/jobs?action=seed", { method: "POST" });

      const data = await res.json();

      if (data.success && data.jobs) {

        setJobs(data.jobs);

        showToast("Loaded 2 sample applications for testing.");

      }

    } catch (err) {

      console.error("Seed error:", err);

    }

  };



  // Save Job Handler

  const handleSaveJob = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      if (editingJob) {

        const res = await fetch("/api/jobs", {

          method: "PUT",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ id: editingJob.id, ...jobForm }),

        });

        const data = await res.json();

        if (data.success) {

          setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? data.job : j)));

          showToast("Application updated!");

        }

      } else {

        const res = await fetch("/api/jobs", {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ ...jobForm, userId: currentUser?.id }),

        });

        const data = await res.json();

        if (data.success) {

          setJobs((prev) => [data.job, ...prev]);

          showToast(`Created application for ${data.job.company}!`);

        }

      }

      setIsJobModalOpen(false);

    } catch (err) {

      console.error("Job save error:", err);

    }

  };



  // Save Template Handler

  const handleSaveTemplate = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      if (editingTpl) {

        const res = await fetch("/api/templates", {

          method: "PUT",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ id: editingTpl.id, ...tplForm }),

        });

        const data = await res.json();

        if (data.success) {

          setTemplates((prev) => prev.map((t) => (t.id === editingTpl.id ? data.template : t)));

          showToast("Template updated!");

        }

      } else {

        const res = await fetch("/api/templates", {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify(tplForm),

        });

        const data = await res.json();

        if (data.success) {

          setTemplates((prev) => [...prev, data.template]);

          showToast("New template created!");

        }

      }

      setIsTplModalOpen(false);

    } catch (err) {

      console.error("Template save error:", err);

    }

  };



  // Delete Template Handler

  const handleDeleteTemplate = async (id: string) => {

    if (!confirm("Are you sure you want to delete this template?")) return;

    try {

      await fetch(`/api/templates?id=${id}`, { method: "DELETE" });

      setTemplates((prev) => prev.filter((t) => t.id !== id));

      showToast("Template deleted.");

    } catch (err) {

      console.error("Delete template error:", err);

    }

  };



  // Update Job Status

  const updateStatus = async (job: JobApplication, newStatus: JobApplication["status"]) => {

    const updated = {

      ...job,

      status: newStatus,

      appliedDate: newStatus === "applied" && !job.appliedDate ? new Date().toISOString().split("T")[0] : job.appliedDate,

    };

    await fetch("/api/jobs", {

      method: "PUT",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(updated),

    });

    setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));

  };



  // Delete Job

  const handleDeleteJob = async (id: string) => {

    if (!confirm("Are you sure you want to remove this application?")) return;

    await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });

    setJobs((prev) => prev.filter((j) => j.id !== id));

    showToast("Application removed.");

  };



  // Dynamic Pipeline Metrics

  const totalEmailsSent = jobs.reduce((acc, j) => acc + (j.emailHistory?.length || 0), 0);

  const interviewingCount = jobs.filter((j) => j.status === "interviewing").length;

  const appliedCount = jobs.filter((j) => j.status === "applied").length;

  const offerCount = jobs.filter((j) => j.status === "offer").length;



  // Filtered Jobs

  const filteredJobs = jobs.filter((job) => {

    const matchesSearch =

      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||

      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||

      job.contactName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;

  });



  // Dynamic Pipeline Columns for Kanban

  const KANBAN_STAGES: Array<{ id: JobApplication["status"]; label: string; color: string }> = [

    { id: "wishlist", label: "Wishlist", color: "border-slate-700 text-slate-300" },

    { id: "applied", label: "Cold Emailed", color: "border-blue-500/50 text-blue-400" },

    { id: "interviewing", label: "Interviewing", color: "border-amber-500/50 text-amber-400" },

    { id: "offer", label: "Offer Received", color: "border-emerald-500/50 text-emerald-400" },

    { id: "rejected", label: "Archived", color: "border-red-500/50 text-red-400" },

  ];



  return (

    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans selection:bg-blue-600 selection:text-white">

      {!authReady || !currentUser ? (

        <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">

          <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />

          {authReady ? "Redirecting to sign in..." : "Checking your session..."}

        </div>

      ) : (

      <>

      {/* Toast Notification */}

      {toastMessage && (

        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500/50 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">

          <Sparkles className="w-4 h-4 text-blue-400" />

          <span>{toastMessage}</span>

        </div>

      )}



      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Candidate Profile Summary */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex-shrink-0">
                  JobFlow AI
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                  Dynamic Engine
                </span>
              </div>
              <div
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-300 cursor-pointer transition group mt-0.5"
                title="Click to edit candidate profile"
              >
                <span className="font-semibold text-slate-300 flex-shrink-0">{profile.name || "Tatrasi Amar"}</span>
                <span className="text-slate-600 flex-shrink-0">•</span>
                <span className="truncate max-w-[140px] sm:max-w-xs md:max-w-md text-slate-400 group-hover:text-blue-300">
                  {profile.title || "Full-Stack Software Engineer"}
                </span>
                <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Right Controls: Relay Status + Primary Add CTA + SaaS Auth */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* SMTP Status Pill */}
            <button
              onClick={checkConnection}
              disabled={isCheckingConn}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
                connStatus?.connected
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
              }`}
              title="Click to test SMTP Relay"
            >
              <span className={`w-2 h-2 rounded-full ${connStatus?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <RefreshCw className={`w-3 h-3 ${isCheckingConn ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{connStatus?.connected ? `Relay Online (${connStatus.latencyMs}ms)` : "Test SMTP"}</span>
              <span className="sm:hidden">{connStatus?.connected ? "Online" : "Test"}</span>
            </button>

            {/* Quick Add CTA */}
            <button
              onClick={() => {
                setEditingJob(null);
                setJobForm({
                  company: "",
                  role: profile.title || "Software Engineer",
                  contactName: "",
                  contactEmail: "",
                  jobUrl: "",
                  location: profile.location || "Remote",
                  salary: "",
                  status: "wishlist",
                  notes: "",
                });
                setIsJobModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* SaaS Auth Nav Indicator */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow ring-2 ring-blue-500/20">
                  {currentUser.user_metadata?.full_name ? currentUser.user_metadata.full_name[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : "U")}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-semibold text-white block leading-none truncate max-w-[120px]">{currentUser.user_metadata?.full_name || currentUser.email.split("@")[0]}</span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Cloud Synced
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-slate-800">
                <button
                  onClick={() => router.push("/login")}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" /> Sign In
                </button>
                <button
                  onClick={() => router.push("/login?mode=signup")}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Start Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SaaS Dashboard Layout: Sidebar + Main Content */}
      <div className="flex w-full min-h-[calc(100vh-4rem)]">
        {/* Fixed Desktop Sidebar Navigation */}
        <aside className="w-64 xl:w-72 flex-shrink-0 border-r border-slate-800/80 bg-slate-900/40 backdrop-blur sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden md:flex flex-col justify-between p-4 z-30">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
                Navigation
              </p>
              <nav className="space-y-1">
                {/* 1. Job Applications */}
                <button
                  onClick={() => setActiveTab("tracker")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    activeTab === "tracker"
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className={`w-4 h-4 ${activeTab === "tracker" ? "text-blue-400" : "text-slate-400"}`} />
                    <span>Job Applications</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
                    {jobs.length}
                  </span>
                </button>

                {/* 2. Discover Live Jobs */}
                <button
                  onClick={() => {
                    setActiveTab("discover");
                    if (discoveredJobs.length === 0) handleSearchLiveJobs();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    activeTab === "discover"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Discover Live Jobs</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live API
                  </span>
                </button>

                {/* 3. Cold Email Outreach */}
                <button
                  onClick={() => setActiveTab("outreach")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    activeTab === "outreach"
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Send className={`w-4 h-4 ${activeTab === "outreach" ? "text-blue-400" : "text-slate-400"}`} />
                    <span>Cold Outreach</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    Direct
                  </span>
                </button>

                {/* 4. Dynamic Templates */}
                <button
                  onClick={() => setActiveTab("templates")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    activeTab === "templates"
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className={`w-4 h-4 ${activeTab === "templates" ? "text-amber-400" : "text-slate-400"}`} />
                    <span>Dynamic Templates</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
                    {templates.length}
                  </span>
                </button>

                {/* 5. Candidate Profile & Resumes */}
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    activeTab === "profile"
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className={`w-4 h-4 ${activeTab === "profile" ? "text-blue-400" : "text-slate-400"}`} />
                    <span>Profile & Resumes</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
                    {resumes.length}
                  </span>
                </button>

                {/* 6. APIs & Account */}
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    activeTab === "settings"
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Key className={`w-4 h-4 ${activeTab === "settings" ? "text-blue-400" : "text-slate-400"}`} />
                    <span>APIs & Account</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    BYOK
                  </span>
                </button>
              </nav>
            </div>

            {/* Quick Metrics in Sidebar */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pipeline Snapshot
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-lg font-bold text-white">{jobs.length}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Tracked</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-lg font-bold text-emerald-400">
                    {jobs.filter((j) => j.status === "applied" || j.status === "interviewing" || j.status === "offer").length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">In Motion</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer: Candidate & Relay Status */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div
              onClick={() => setActiveTab("profile")}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 transition cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : "TA"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                  {profile.name || "Tatrasi Amar"}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {profile.title ? profile.title.split("(")[0].trim() : "Software Engineer"}
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition" />
            </div>

            <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${connStatus?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                {connStatus?.connected ? `Relay Online (${connStatus.latencyMs}ms)` : "SMTP Offline"}
              </span>
              <span>v2.4 SaaS</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-6 pb-16 overflow-x-hidden">
          {/* Mobile Navigation for small screens (< md) */}
          <div className="md:hidden flex border-b border-slate-800/80 gap-1 sm:gap-2 mb-6 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab("tracker")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
                activeTab === "tracker"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Jobs ({jobs.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("discover");
                if (discoveredJobs.length === 0) handleSearchLiveJobs();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
                activeTab === "discover"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setActiveTab("outreach")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
                activeTab === "outreach"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Outreach</span>
            </button>

            <button
              onClick={() => setActiveTab("templates")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
                activeTab === "templates"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Templates ({templates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile ({resumes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>APIs</span>
            </button>
          </div>

          {/* Tab 1: Dynamic Job Applications Tracker */}

        {activeTab === "tracker" && (

          <div className="space-y-6">

            {/* Dynamic Pipeline Summary Metrics Bar */}

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">

              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">

                <div>

                  <span className="text-[11px] text-slate-400 block font-medium">Tracked Jobs</span>

                  <span className="text-xl font-bold text-white">{jobs.length}</span>

                </div>

                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">

                  <Briefcase className="w-4 h-4" />

                </div>

              </div>



              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">

                <div>

                  <span className="text-[11px] text-slate-400 block font-medium">Cold Emailed</span>

                  <span className="text-xl font-bold text-blue-400">{appliedCount}</span>

                </div>

                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">

                  <Send className="w-4 h-4" />

                </div>

              </div>



              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">

                <div>

                  <span className="text-[11px] text-slate-400 block font-medium">Interviewing</span>

                  <span className="text-xl font-bold text-amber-400">{interviewingCount}</span>

                </div>

                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">

                  <Clock className="w-4 h-4" />

                </div>

              </div>



              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">

                <div>

                  <span className="text-[11px] text-slate-400 block font-medium">Offers</span>

                  <span className="text-xl font-bold text-emerald-400">{offerCount}</span>

                </div>

                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">

                  <CheckCircle2 className="w-4 h-4" />

                </div>

              </div>



              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between col-span-2 sm:col-span-1">

                <div>

                  <span className="text-[11px] text-slate-400 block font-medium">Outreach Sent</span>

                  <span className="text-xl font-bold text-indigo-400">{totalEmailsSent}</span>

                </div>

                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">

                  <Mail className="w-4 h-4" />

                </div>

              </div>

            </div>



            {/* Control Bar: Search, Filters, View Mode & Action Buttons */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-3.5 shadow-sm">
              {/* Row 1: Search & Filter Pills */}
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full lg:w-80 flex-shrink-0">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search company, role, recruiter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2 text-slate-500 hover:text-slate-300 text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Status Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                  {["all", "wishlist", "applied", "interviewing", "offer", "rejected"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition whitespace-nowrap ${
                        statusFilter === s
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      {s === "all" ? `All (${jobs.length})` : `${s === "applied" ? "Cold Emailed" : s === "rejected" ? "Archived" : s} (${jobs.filter((j) => j.status === s).length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: View Switcher & Action Tools */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                {/* Left: View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-400">View:</span>
                  <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-0.5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                        viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      }`}
                      title="Grid Card View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode("kanban")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                        viewMode === "kanban" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      }`}
                      title="Kanban Board View"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>Board</span>
                    </button>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
                    title="Automatically extract company, role, and recruiter from any Job URL or text"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Smart Import</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingJob(null);
                      setJobForm({
                        company: "",
                        role: profile.title || "Software Engineer",
                        contactName: "",
                        contactEmail: "",
                        jobUrl: "",
                        location: profile.location || "Remote",
                        salary: "",
                        status: "wishlist",
                        notes: "",
                      });
                      setIsJobModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Application</span>
                  </button>

                  {jobs.length > 0 && (
                    <button
                      onClick={handleClearAllJobs}
                      className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30 text-xs font-medium transition"
                      title="Clear All Applications from Database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* View Mode 1: Grid View */}

            {viewMode === "grid" && filteredJobs.length > 0 && (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {filteredJobs.map((job) => (

                  <div

                    key={job.id}

                    className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"

                  >

                    <div>

                      <div className="flex items-start justify-between gap-3 mb-2">

                        <div>

                          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition flex items-center gap-2">

                            {job.company}

                            {job.jobUrl && (

                              <a href={job.jobUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300">

                                <ExternalLink className="w-3.5 h-3.5" />

                              </a>

                            )}

                          </h3>

                          <p className="text-xs font-semibold text-slate-300 mt-0.5">{job.role}</p>

                        </div>



                        <select

                          value={job.status}

                          onChange={(e) => updateStatus(job, e.target.value as any)}

                          className="bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1 text-slate-300 outline-none cursor-pointer focus:border-blue-500 font-medium"

                        >

                          <option value="wishlist">Wishlist</option>

                          <option value="applied">Cold Emailed</option>

                          <option value="interviewing">Interviewing</option>

                          <option value="offer">Offer Received</option>

                          <option value="rejected">Archived</option>

                        </select>

                      </div>



                      <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-3">

                        {job.location && (

                          <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">

                            <MapPin className="w-3 h-3 text-slate-500" /> {job.location}

                          </span>

                        )}

                        {job.salary && (

                          <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-mono">

                            <DollarSign className="w-3 h-3" /> {job.salary}

                          </span>

                        )}

                      </div>



                      {job.contactEmail && (

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 mb-3 text-xs">

                          <span className="text-slate-500 block mb-0.5 font-medium">Recruiter / Contact:</span>

                          <div className="flex items-center justify-between">

                            <span className="text-slate-200 font-medium truncate">

                              {job.contactName ? `${job.contactName} (${job.contactEmail})` : job.contactEmail}

                            </span>

                            {job.emailHistory && job.emailHistory.length > 0 && (

                              <span className="text-blue-400 text-xs flex items-center gap-1 flex-shrink-0">

                                <CheckCircle2 className="w-3 h-3" /> {job.emailHistory.length} sent

                              </span>

                            )}

                          </div>

                        </div>

                      )}



                      {job.notes && (

                        <p className="text-xs text-slate-400 italic line-clamp-2 mb-3 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">

                          "{job.notes}"

                        </p>

                      )}

                    </div>



                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">

                      <button

                        onClick={() => handleSelectJobForOutreach(job)}

                        className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition"

                      >

                        <Send className="w-3.5 h-3.5" />

                        {job.emailHistory && job.emailHistory.length > 0 ? "Follow Up" : "Send Cold Email"}

                      </button>



                      <div className="flex items-center gap-1.5">

                        <button

                          onClick={() => {

                            setEditingJob(job);

                            setJobForm({

                              company: job.company,

                              role: job.role,

                              contactName: job.contactName || "",

                              contactEmail: job.contactEmail || "",

                              jobUrl: job.jobUrl || "",

                              location: job.location || "Remote",

                              salary: job.salary || "",

                              status: job.status,

                              notes: job.notes || "",

                            });

                            setIsJobModalOpen(true);

                          }}

                          className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"

                          title="Edit Job Application"

                        >

                          <Edit3 className="w-3.5 h-3.5" />

                        </button>

                        <button

                          onClick={() => handleDeleteJob(job.id)}

                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"

                          title="Delete Application"

                        >

                          <Trash2 className="w-3.5 h-3.5" />

                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}



            {/* View Mode 2: Kanban Stages Board */}

            {viewMode === "kanban" && filteredJobs.length > 0 && (

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">

                {KANBAN_STAGES.map((stage) => {

                  const stageJobs = filteredJobs.filter((j) => j.status === stage.id);

                  return (

                    <div key={stage.id} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-w-[220px]">

                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">

                        <span className={`text-xs font-bold ${stage.color}`}>{stage.label}</span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-400">

                          {stageJobs.length}

                        </span>

                      </div>



                      <div className="space-y-2.5 flex-1">

                        {stageJobs.map((job) => (

                          <div key={job.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition">

                            <h4 className="text-xs font-bold text-white truncate">{job.company}</h4>

                            <p className="text-[11px] text-slate-400 truncate mb-2">{job.role}</p>



                            {job.contactEmail && (

                              <p className="text-[10px] text-slate-500 truncate mb-2">{job.contactEmail}</p>

                            )}



                            <div className="pt-2 border-t border-slate-900 flex items-center justify-between">

                              <button

                                onClick={() => handleSelectJobForOutreach(job)}

                                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-semibold"

                              >

                                <Send className="w-2.5 h-2.5" /> Pitch

                              </button>



                              {/* Advance Stage Shortcuts */}

                              {stage.id === "wishlist" && (

                                <button

                                  onClick={() => updateStatus(job, "applied")}

                                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"

                                  title="Mark as Cold Emailed"

                                >

                                  Applied &rarr;

                                </button>

                              )}

                              {stage.id === "applied" && (

                                <button

                                  onClick={() => updateStatus(job, "interviewing")}

                                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"

                                  title="Move to Interviewing"

                                >

                                  Interview &rarr;

                                </button>

                              )}

                              {stage.id === "interviewing" && (

                                <button

                                  onClick={() => updateStatus(job, "offer")}

                                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"

                                  title="Offer Received"

                                >

                                  Offer!

                                </button>

                              )}

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                  );

                })}

              </div>

            )}



            {/* Zero Fake State: Truly Dynamic Empty Pipeline */}

            {filteredJobs.length === 0 && (
              <div className="text-center py-16 px-6 bg-gradient-to-b from-slate-900/50 to-slate-950/60 rounded-3xl border border-slate-800/80 max-w-2xl mx-auto space-y-5 shadow-xl my-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-inner">
                  <Compass className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Your Dynamic Pipeline is Ready</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                    Zero static mock data. Track active applications, search real openings online, or paste job links to auto-extract details.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab("discover");
                      if (discoveredJobs.length === 0) handleSearchLiveJobs();
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition"
                  >
                    <Globe className="w-4 h-4" /> Discover Live Jobs (API)
                  </button>
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition"
                  >
                    <Zap className="w-4 h-4 text-amber-400" /> Smart Import URL/Text
                  </button>
                  <button
                    onClick={() => {
                      setEditingJob(null);
                      setJobForm({
                        company: "",
                        role: profile.title || "Software Engineer",
                        contactName: "",
                        contactEmail: "",
                        jobUrl: "",
                        location: profile.location || "Remote",
                        salary: "",
                        status: "wishlist",
                        notes: "",
                      });
                      setIsJobModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" /> Add Application
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-800/60">
                  <button
                    onClick={handleSeedSampleJobs}
                    className="text-xs text-slate-500 hover:text-slate-300 underline transition"
                  >
                    Need test data? Load 2 clean sample jobs for demonstration
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Discover Live Jobs (Real Dynamic Job Feed API) */}

        {activeTab === "discover" && (

          <div className="space-y-6">

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

                <div>

                  <h2 className="text-base font-bold text-white flex items-center gap-2">

                    <Globe className="w-5 h-5 text-emerald-400" />

                    Live Job Search & Discovery

                  </h2>

                  <p className="text-xs text-slate-400 mt-0.5">

                    Queries real-time tech job feeds (Remotive & Arbeitnow APIs). Track directly or send a tailored cold pitch in 1 click.

                  </p>

                </div>



                {/* Quick Query Presets */}

                <div className="flex flex-wrap items-center gap-1.5">

                  {["Java", "Spring Boot", "React", "Full Stack", "Backend", "Frontend", "Remote"].map((tag) => (

                    <button

                      key={tag}

                      onClick={() => {

                        setDiscoverQuery(tag);

                        handleSearchLiveJobs(tag);

                      }}

                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition"

                    >

                      {tag}

                    </button>

                  ))}

                </div>

              </div>



              {/* Search Bar */}

              <form

                onSubmit={(e) => {

                  e.preventDefault();

                  handleSearchLiveJobs();

                }}

                className="flex gap-2"

              >

                <div className="relative flex-1">

                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                  <input

                    type="text"

                    value={discoverQuery}

                    onChange={(e) => setDiscoverQuery(e.target.value)}

                    placeholder="Search by title, technology or keyword (e.g. Java, Spring Boot, React, Full Stack)..."

                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"

                  />

                </div>

                <button

                  type="submit"

                  disabled={isSearchingJobs}

                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 disabled:opacity-50 transition"

                >

                  {isSearchingJobs ? (

                    <>

                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Searching Live...

                    </>

                  ) : (

                    <>

                      <Search className="w-3.5 h-3.5" /> Search Jobs

                    </>

                  )}

                </button>

              </form>

            </div>



            {/* Results Grid */}

            {discoveredJobs.length > 0 && (

              <div className="space-y-4">

                <div className="flex items-center justify-between text-xs text-slate-400">

                  <span>Found <strong>{discoveredJobs.length}</strong> active openings for "{discoverQuery}"</span>

                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {discoveredJobs.map((job) => (

                    <div

                      key={job.id}

                      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"

                    >

                      <div>

                        <div className="flex items-start justify-between gap-2 mb-2">

                          <div>

                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mb-1.5">

                              {job.source}

                            </span>

                            <h3 className="text-sm font-bold text-white line-clamp-1">{job.company}</h3>

                            <p className="text-xs font-semibold text-slate-300 mt-0.5 line-clamp-1">{job.role}</p>

                          </div>

                          {job.url && (

                            <a

                              href={job.url}

                              target="_blank"

                              rel="noreferrer"

                              className="p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800"

                              title="Open original job posting"

                            >

                              <ExternalLink className="w-3.5 h-3.5" />

                            </a>

                          )}

                        </div>



                        <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400 mb-3">

                          <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">

                            <MapPin className="w-3 h-3 text-slate-500" /> {job.location}

                          </span>

                          {job.salary && (

                            <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-mono">

                              <DollarSign className="w-3 h-3" /> {job.salary}

                            </span>

                          )}

                        </div>



                        {job.tags && job.tags.length > 0 && (

                          <div className="flex flex-wrap gap-1 mb-3">

                            {job.tags.map((t, idx) => (

                              <span key={idx} className="text-[10px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800/80">

                                #{t}

                              </span>

                            ))}

                          </div>

                        )}



                        {job.description && (

                          <p className="text-[11px] text-slate-400 line-clamp-3 mb-4 leading-relaxed">

                            {job.description}

                          </p>

                        )}

                      </div>



                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">

                        <button

                          onClick={() => handleTrackDiscoveredJob(job)}

                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition"

                        >

                          <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" /> Track Job

                        </button>

                        <button

                          onClick={() => handlePitchDiscoveredJob(job)}

                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition"

                        >

                          <Send className="w-3.5 h-3.5" /> Cold Pitch

                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}



            {isSearchingJobs && (

              <div className="text-center py-16 text-slate-400 space-y-2">

                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-400" />

                <p className="text-xs">Fetching active jobs from global live API feeds...</p>

              </div>

            )}



            {!isSearchingJobs && discoveredJobs.length === 0 && hasSearched && (

              <div className="text-center py-14 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 text-slate-400">

                <p className="text-xs">No active jobs found matching "{discoverQuery}". Try a broader term like "Software", "React", or "Developer".</p>

              </div>

            )}

          </div>

        )}



        {/* Tab 3: Dynamic Cold Email Outreach */}

        {activeTab === "outreach" && (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">

              {/* Linked Job Selector */}

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">

                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">

                  <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Target Job Profile:

                </span>

                <select

                  value={selectedJobId}

                  onChange={(e) => {

                    const found = jobs.find((j) => j.id === e.target.value);

                    if (found) handleSelectJobForOutreach(found);

                    else setSelectedJobId(e.target.value);

                  }}

                  className="bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-1.5 text-white outline-none focus:border-blue-500 w-full sm:w-auto"

                >

                  <option value="">Custom / Direct Outreach</option>

                  {jobs.map((j) => (

                    <option key={j.id} value={j.id}>

                      {j.company} — {j.role}

                    </option>

                  ))}

                </select>

              </div>



              {/* Dynamic Template Buttons */}

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">

                <div className="flex items-center justify-between">

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">

                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Apply Dynamic Template:

                  </span>

                  <button

                    onClick={() => setActiveTab("templates")}

                    className="text-xs text-blue-400 hover:underline"

                  >

                    Manage Templates ({templates.length}) &rarr;

                  </button>

                </div>

                <div className="flex flex-wrap gap-2 pt-1">

                  {templates.map((tpl) => (

                    <button

                      key={tpl.id}

                      type="button"

                      onClick={() => applyTemplate(tpl.id)}

                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${

                        selectedTemplateId === tpl.id

                          ? "bg-blue-600/30 text-blue-300 border-blue-500/50"

                          : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"

                      }`}

                    >

                      {tpl.name}

                    </button>

                  ))}

                </div>

              </div>



              {/* Composer Box */}

              <form onSubmit={handleSendEmail} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">

                {sendResult && (

                  <div

                    className={`p-4 rounded-xl border flex items-start gap-3 ${

                      sendResult.type === "success"

                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"

                        : "bg-red-500/10 border-red-500/30 text-red-300"

                    }`}

                  >

                    {sendResult.type === "success" ? (

                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />

                    ) : (

                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />

                    )}

                    <div className="text-xs leading-relaxed">{sendResult.message}</div>

                  </div>

                )}



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

                  <div>

                    <label className="block font-semibold text-slate-300 mb-1">Company Name</label>

                    <input

                      type="text"

                      value={companyName}

                      onChange={(e) => {

                        setCompanyName(e.target.value);

                        if (selectedTemplateId) applyTemplate(selectedTemplateId, e.target.value, roleTitle, recipientName);

                      }}

                      placeholder="e.g. Acme Corp"

                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                    />

                  </div>

                  <div>

                    <label className="block font-semibold text-slate-300 mb-1">Role Title</label>

                    <input

                      type="text"

                      value={roleTitle}

                      onChange={(e) => {

                        setRoleTitle(e.target.value);

                        if (selectedTemplateId) applyTemplate(selectedTemplateId, companyName, e.target.value, recipientName);

                      }}

                      placeholder="e.g. Senior Software Engineer"

                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                    />

                  </div>

                </div>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

                  <div>

                    <label className="block font-semibold text-slate-300 mb-1">Recruiter Name</label>

                    <input

                      type="text"

                      value={recipientName}

                      onChange={(e) => {

                        setRecipientName(e.target.value);

                        if (selectedTemplateId) applyTemplate(selectedTemplateId, companyName, roleTitle, e.target.value);

                      }}

                      placeholder="e.g. Sarah Jenkins"

                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                    />

                  </div>

                  <div>

                    <label className="block font-semibold text-slate-300 mb-1">Recruiter Email *</label>

                    <input

                      type="email"

                      required

                      value={recipient}

                      onChange={(e) => setRecipient(e.target.value)}

                      placeholder="recruiter@company.com"

                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-mono"

                    />

                  </div>

                </div>



                <div className="text-xs">

                  <label className="block font-semibold text-slate-300 mb-1">Subject Line</label>

                  <input

                    type="text"

                    required

                    value={subject}

                    onChange={(e) => setSubject(e.target.value)}

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>



                <div className="text-xs">

                  <div className="flex items-center justify-between mb-1">

                    <label className="block font-semibold text-slate-300">Email Message (Plain Text & HTML)</label>

                    <span className="text-[10px] text-slate-500">Variables automatically interpolated</span>

                  </div>

                  <textarea

                    rows={8}

                    required

                    value={body}

                    onChange={(e) => setBody(e.target.value)}

                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-sans leading-relaxed text-xs"

                  />

                </div>



                {/* Sender & Reply-To Routing Status */}

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">

                  <span className="text-slate-400 flex items-center gap-1.5">

                    <Mail className="w-3.5 h-3.5 text-blue-400" />

                    <span>Recruiter Reply-To:</span>

                    <code className="text-blue-300 bg-blue-950/50 px-1.5 py-0.5 rounded font-mono">

                      {settings.replyToEmail || settings.senderEmail}

                    </code>

                  </span>

                  <span className="text-emerald-400 font-medium hidden sm:inline">✓ Replies route directly to your inbox</span>

                </div>



                <div className="pt-3">

                  <button

                    type="submit"

                    disabled={isSending}

                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition"

                  >

                    {isSending ? (

                      <>

                        <RefreshCw className="w-4 h-4 animate-spin" />

                        Transmitting via SMTP Relay...

                      </>

                    ) : (

                      <>

                        <Send className="w-4 h-4" />

                        Send Cold Email

                      </>

                    )}

                  </button>

                </div>

              </form>

            </div>



            {/* Sidebar Resume & Attachment Manager */}

            <div className="space-y-6">

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">

                <div className="flex items-center justify-between">

                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">

                    <Paperclip className="w-3.5 h-3.5 text-blue-400" /> Resume & Attachments

                  </h4>

                  <span className="text-[10px] text-slate-500">{uploadedFiles.length} available</span>

                </div>



                <div className="space-y-2">

                  {uploadedFiles.map((file) => (

                    <div

                      key={file.filename}

                      onClick={() => setSelectedAttachment(file.filename)}

                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${

                        selectedAttachment === file.filename

                          ? "bg-blue-600/15 border-blue-500/40 text-blue-200"

                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"

                      }`}

                    >

                      <div className="flex items-center gap-2 truncate">

                        <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />

                        <span className="truncate font-medium">{file.filename}</span>

                      </div>

                      <span className="text-[10px] text-slate-500 flex-shrink-0">{file.sizeKb} KB</span>

                    </div>

                  ))}

                </div>



                {/* Upload New File */}

                <div className="pt-2 border-t border-slate-800">

                  <label className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-blue-500/60 bg-slate-950 flex items-center justify-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition">

                    <Upload className="w-3.5 h-3.5 text-blue-400" />

                    <span>{isUploading ? "Uploading..." : "Upload New Resume PDF"}</span>

                    <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} className="hidden" />

                  </label>

                </div>

              </div>



              {/* Dynamic Profile Snippet */}

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">

                <div className="flex items-center justify-between mb-3">

                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">

                    <User className="w-3.5 h-3.5 text-blue-400" /> Active Candidate

                  </h4>

                  <button onClick={() => setActiveTab("profile")} className="text-xs text-blue-400 hover:underline">

                    Edit Profile

                  </button>

                </div>

                <div className="space-y-1.5 text-xs text-slate-300">

                  <p className="font-semibold text-white">{profile.name}</p>

                  <p className="text-slate-400">{profile.title}</p>

                  <p className="text-emerald-400 font-medium">{profile.noticePeriod}</p>

                </div>

              </div>

            </div>

          </div>

        )}



        {/* Tab 4: Dynamic Templates Manager */}

        {activeTab === "templates" && (

          <div className="space-y-6">

            <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-800">

              <div>

                <h2 className="text-base font-bold text-white">Dynamic Cold Email Templates</h2>

                <p className="text-xs text-slate-400">

                  Templates support dynamic tags like <code className="text-blue-300">{"{{company}}"}</code>,{" "}

                  <code className="text-blue-300">{"{{role}}"}</code>, <code className="text-blue-300">{"{{candidate_name}}"}</code>, and{" "}

                  <code className="text-blue-300">{"{{candidate_skills}}"}</code>.

                </p>

              </div>



              <button

                onClick={() => {

                  setEditingTpl(null);

                  setTplForm({ name: "", category: "General", subject: "", body: "" });

                  setIsTplModalOpen(true);

                }}

                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"

              >

                <Plus className="w-4 h-4" /> Add Template

              </button>

            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {templates.map((tpl) => (

                <div key={tpl.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">

                  <div>

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">

                        {tpl.category}

                      </span>

                      <div className="flex items-center gap-1">

                        <button

                          onClick={() => {

                            setEditingTpl(tpl);

                            setTplForm({

                              name: tpl.name,

                              category: tpl.category,

                              subject: tpl.subject,

                              body: tpl.body,

                            });

                            setIsTplModalOpen(true);

                          }}

                          className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"

                        >

                          <Edit3 className="w-3.5 h-3.5" />

                        </button>

                        <button

                          onClick={() => handleDeleteTemplate(tpl.id)}

                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10"

                        >

                          <Trash2 className="w-3.5 h-3.5" />

                        </button>

                      </div>

                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">{tpl.name}</h3>

                    <p className="text-xs text-slate-400 font-mono mb-3 bg-slate-950 p-2 rounded-lg border border-slate-800">

                      {tpl.subject}

                    </p>

                    <p className="text-xs text-slate-300 font-sans whitespace-pre-line line-clamp-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">

                      {tpl.body}

                    </p>

                  </div>



                  <div className="pt-3 border-t border-slate-800 mt-4 flex justify-end">

                    <button

                      onClick={() => {

                        applyTemplate(tpl.id);

                        setActiveTab("outreach");

                      }}

                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"

                    >

                      Use in Composer &rarr;

                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}



{activeTab === "profile" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Sub-Navigation Pills */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setProfileSubTab("profile")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  profileSubTab === "profile"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Candidate Profile & Skills</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileSubTab("resumes")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  profileSubTab === "resumes"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Resume Management Center</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {resumes.length}
                </span>
              </button>
            </div>

            {/* Sub-tab A: Personal & Professional Profile */}
            {profileSubTab === "profile" && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Dynamic Candidate Profile
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage your identity, professional stack, and credentials. All cold email templates dynamically update based on these values!
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="e.g. Tatrasi Amar"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Professional Title / Headline</label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="e.g. Full-Stack Software Engineer (Java • React)"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Primary Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition font-mono"
                        placeholder="youremail@gmail.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="e.g. Hyderabad, India / Remote"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Years of Experience</label>
                      <input
                        type="text"
                        value={profile.experience}
                        onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="e.g. 2 years"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Notice Period / Availability</label>
                      <input
                        type="text"
                        value={profile.noticePeriod}
                        onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="e.g. Immediate Joiner / 15 Days"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Technical Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={profile.skills}
                      onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                      placeholder="Java, Spring Boot, React, Next.js, TypeScript, PostgreSQL, REST APIs, Microservices"
                    />
                    {profile.skills && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {profile.skills.split(",").map((s, idx) => s.trim() && (
                          <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={profile.linkedinUrl || ""}
                        onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
                      <input
                        type="url"
                        value={profile.githubUrl || ""}
                        onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Portfolio / Personal Website</label>
                      <input
                        type="url"
                        value={profile.portfolioUrl || ""}
                        onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="https://yourportfolio.dev"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Professional Bio Summary</label>
                    <textarea
                      rows={3}
                      value={profile.bio || ""}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition leading-relaxed font-sans"
                      placeholder="Brief overview of your experience, key achievements, and current search focus..."
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-500/20"
                    >
                      Save Candidate Profile
                    </button>
                    {currentUser && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Synced with your Supabase account
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Sub-tab B: Resume Management Center */}
            {profileSubTab === "resumes" && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Resume Management Center
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload multiple versions of your resume (PDF/DOCX). Set your active resume to automatically attach to cold email applications!
                  </p>
                </div>

                {/* Upload New Resume Dropzone */}
                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-950/40 text-center transition group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-semibold text-white mb-1">Upload New Resume File</h3>
                  <p className="text-[11px] text-slate-400 mb-3">Supports PDF, DOCX, DOC up to 10MB</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-blue-500/20 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingResume ? "Uploading Resume..." : "Select Resume File"}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleUploadResumeFile}
                      disabled={isUploadingResume}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Resumes List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Uploaded Resumes ({resumes.length})</span>
                    <span className="text-[11px] font-normal text-slate-500">Active default attaches to cold emails</span>
                  </h3>

                  {resumes.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400">
                      No resumes uploaded yet. Upload a PDF resume above to start attaching to applications.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {resumes.map((r) => (
                        <div
                          key={r.id}
                          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                            r.isDefault
                              ? "bg-blue-600/10 border-blue-500/40 shadow-sm"
                              : "bg-slate-950 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex-shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white truncate max-w-[220px] sm:max-w-xs">{r.fileName}</h4>
                                {r.isDefault && (
                                  <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                                    Active for Outreach
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {r.fileSizeKb} KB • Uploaded {r.uploadedAt}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                            {!r.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultResume(r.id)}
                                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-medium transition"
                                title="Make this resume the active default for cold outreach"
                              >
                                Set as Default
                              </button>
                            )}

                            {r.downloadUrl && (
                              <a
                                href={r.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 text-[11px] font-medium inline-flex items-center gap-1 transition"
                                title="Preview or download resume file"
                              >
                                <ExternalLink className="w-3 h-3" /> Preview
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteResume(r.id, r.fileName)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                              title="Delete resume file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Dynamic APIs & Account Credentials */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Sub-Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setSettingsSubTab("mailing")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  settingsSubTab === "mailing"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Cold Mailing & SMTP</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab("jobsearch")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  settingsSubTab === "jobsearch"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Job Search APIs (BYOK)</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab("security")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  settingsSubTab === "security"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Account & Password</span>
              </button>
            </div>

            {/* Sub-tab 1: Cold Mailing & SMTP Relay */}
            {settingsSubTab === "mailing" && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Cold Mailing & SMTP Relay Credentials
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Choose how your cold emails are dispatched. Use Brevo relay or connect your personal Gmail with a Google App Password.
                  </p>
                </div>

                {/* Provider Quick Switcher Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setSettings({
                        ...settings,
                        smtpHost: "smtp.gmail.com",
                        smtpPort: "465",
                        smtpUser: profile.email || "tatrasiamar123@gmail.com",
                        senderEmail: profile.email || "tatrasiamar123@gmail.com",
                        replyToEmail: profile.email || "tatrasiamar123@gmail.com",
                      });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      settings.smtpHost === "smtp.gmail.com"
                        ? "bg-blue-600/15 border-blue-500/50 text-white shadow-lg shadow-blue-500/10"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-red-400" /> Gmail SMTP (Direct)
                        </span>
                        {settings.smtpHost === "smtp.gmail.com" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Active</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        <strong>100% shows your personal Gmail</strong>. Uses 16-character Google App Password.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-2 font-medium">✓ Zero third-party domain in sender</span>
                  </div>

                  <div
                    onClick={() => {
                      setSettings({
                        ...settings,
                        smtpHost: "smtp-relay.brevo.com",
                        smtpPort: "587",
                        smtpUser: "c2812c001@smtp-brevo.com",
                        smtpKey: "",
                        senderEmail: "tatrasiamar123@gmail.com",
                        replyToEmail: "tatrasiamar123@gmail.com",
                      });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      settings.smtpHost.includes("brevo")
                        ? "bg-blue-600/15 border-blue-500/50 text-white shadow-lg shadow-blue-500/10"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Server className="w-4 h-4 text-blue-400" /> Brevo Relay
                        </span>
                        {settings.smtpHost.includes("brevo") && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Active</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        High deliverability relay via Brevo SMTP relay servers.
                      </p>
                    </div>
                    <span className="text-[10px] text-amber-400 mt-2 font-medium">⚠️ Appends brevosend.com on free tier</span>
                  </div>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-300 mb-1">SMTP Host Server</label>
                      <input
                        type="text"
                        value={settings.smtpHost}
                        onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-blue-500"
                        placeholder="e.g. smtp-relay.brevo.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Port</label>
                      <input
                        type="text"
                        value={settings.smtpPort}
                        onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-blue-500"
                        placeholder="587 or 465"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">SMTP Username / Login Email</label>
                      <input
                        type="text"
                        value={settings.smtpUser}
                        onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-blue-500"
                        placeholder="user@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">SMTP Key / App Password</label>
                      <input
                        type="password"
                        value={settings.smtpKey}
                        onChange={(e) => setSettings({ ...settings, smtpKey: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-blue-500"
                        placeholder="API Key or Google App Password"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Verified Sender Email</label>
                      <input
                        type="email"
                        value={settings.senderEmail}
                        onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-blue-500"
                        placeholder="tatrasiamar123@gmail.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Sender Display Name</label>
                      <input
                        type="text"
                        value={settings.senderName}
                        onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                        placeholder="Tatrasi Amar"
                        required
                      />
                    </div>
                  </div>

                  {/* Direct Recruiter Reply-To Routing */}
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-white text-xs">Direct Recruiter Reply-To Routing</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Recruiter replies will automatically land in this personal inbox even when dispatching via SMTP relay.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Reply-To Email</label>
                        <input
                          type="email"
                          value={settings.replyToEmail || ""}
                          onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
                          placeholder="yourname@gmail.com"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Reply-To Name</label>
                        <input
                          type="text"
                          value={settings.replyToName || ""}
                          onChange={(e) => setSettings({ ...settings, replyToName: e.target.value })}
                          placeholder="Your Name"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-500/20"
                    >
                      Save Mailing Credentials
                    </button>
                    <button
                      type="button"
                      onClick={checkConnection}
                      disabled={isCheckingConn}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-2 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCheckingConn ? "animate-spin" : ""}`} />
                      Test Connection
                    </button>
                    {settingsSaved && <span className="text-xs text-emerald-400 font-medium">✓ Saved persistently!</span>}
                  </div>
                </form>
              </div>
            )}

            {/* Sub-tab 2: Job Searching APIs (Bring Your Own Keys) */}
            {settingsSubTab === "jobsearch" && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    Job Search Engine & API Keys (BYOK)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your preferred job search provider. You can use our built-in free open tech feeds (Remotive & Arbeitnow) or bring your own API keys for global live job openings.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  {/* Provider 1: Built-in Open Tech Feeds */}
                  <div
                    onClick={() => setSettings({ ...settings, jobSearchProvider: "open_apis" })}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      settings.jobSearchProvider === "open_apis"
                        ? "bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-blue-400" /> Built-in Open Tech Feeds (Remotive & Arbeitnow)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Free • Zero Key Needed
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Queries real-time active engineering and remote jobs automatically without requiring any third-party developer accounts or API keys.
                    </p>
                  </div>

                  {/* Provider 2: RapidAPI JSearch */}
                  <div
                    onClick={() => setSettings({ ...settings, jobSearchProvider: "rapidapi_jsearch" })}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-3 ${
                      settings.jobSearchProvider === "rapidapi_jsearch"
                        ? "bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-amber-400" /> RapidAPI / JSearch (LinkedIn, Indeed & Glassdoor)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        BYOK Provider
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Connect your RapidAPI key to fetch live job postings directly from LinkedIn, Indeed, Glassdoor, and ZipRecruiter worldwide.
                    </p>
                    {settings.jobSearchProvider === "rapidapi_jsearch" && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <label className="block font-semibold text-slate-200 mb-1">Your RapidAPI Key (X-RapidAPI-Key)</label>
                        <input
                          type="password"
                          value={settings.rapidapiKey || ""}
                          onChange={(e) => setSettings({ ...settings, rapidapiKey: e.target.value })}
                          placeholder="e.g. 748f2c0199msh23b..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:border-blue-500"
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Don't have a key? Get one free at{" "}
                          <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch" target="_blank" rel="noreferrer" className="text-blue-400 underline">
                            rapidapi.com/jsearch
                          </a>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Provider 3: Adzuna Jobs API */}
                  <div
                    onClick={() => setSettings({ ...settings, jobSearchProvider: "adzuna" })}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-3 ${
                      settings.jobSearchProvider === "adzuna"
                        ? "bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-emerald-400" /> Adzuna Developer Jobs API
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        BYOK Provider
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Connect Adzuna developer credentials for searching millions of categorized job postings globally.
                    </p>
                    {settings.jobSearchProvider === "adzuna" && (
                      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-200 mb-1">Adzuna App ID</label>
                          <input
                            type="text"
                            value={settings.adzunaAppId || ""}
                            onChange={(e) => setSettings({ ...settings, adzunaAppId: e.target.value })}
                            placeholder="Your Adzuna App ID"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-200 mb-1">Adzuna App Key</label>
                          <input
                            type="password"
                            value={settings.adzunaAppKey || ""}
                            onChange={(e) => setSettings({ ...settings, adzunaAppKey: e.target.value })}
                            placeholder="Your Adzuna App Key"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-500/20"
                    >
                      Save Job Search API Configuration
                    </button>
                    {settingsSaved && <span className="text-xs text-emerald-400 font-medium ml-3">✓ API settings saved!</span>}
                  </div>
                </form>
              </div>
            )}

            {/* Sub-tab 3: Account Security & Password Management */}
            {settingsSubTab === "security" && (
              <div className="space-y-6">
                {currentUser ? (
                  <>
                    {/* Account Overview Card */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-amber-400" />
                        Account Credentials & Security
                      </h2>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow">
                            {currentUser.user_metadata?.full_name ? currentUser.user_metadata.full_name[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : "U")}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{currentUser.user_metadata?.full_name || "Candidate"}</span>
                            <span className="text-[11px] text-slate-400 font-mono block">{currentUser.email}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 block mb-1">
                            Supabase Cloud Synced
                          </span>
                          <span className="text-[10px] text-slate-500 block font-mono">ID: {currentUser.id.slice(0, 12)}...</span>
                        </div>
                      </div>

                      {/* Update Display Name */}
                      <form onSubmit={handleUpdateDisplayName} className="pt-2 space-y-3">
                        <label className="block text-xs font-semibold text-slate-300">Update Account Display Name</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={displayNameInput || (currentUser.user_metadata?.full_name || "")}
                            onChange={(e) => setDisplayNameInput(e.target.value)}
                            placeholder="Enter your full name"
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-blue-500"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                          >
                            Update Name
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Change Account Password */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Key className="w-4 h-4 text-blue-400" />
                        Change Account Password
                      </h3>
                      <p className="text-xs text-slate-400">
                        Update your password for cloud authentication. Passwords must be at least 6 characters long.
                      </p>

                      {passwordStatus && (
                        <div
                          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                            passwordStatus.type === "success"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : "bg-red-500/10 border-red-500/30 text-red-300"
                          }`}
                        >
                          {passwordStatus.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          <span>{passwordStatus.message}</span>
                        </div>
                      )}

                      <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs max-w-md">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-mono"
                            required
                            minLength={6}
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-mono"
                            required
                            minLength={6}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdatingPassword}
                          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-500/20 disabled:opacity-50"
                        >
                          {isUpdatingPassword ? "Updating Password..." : "Update Password"}
                        </button>
                      </form>
                    </div>

                    {/* Sign Out CTA */}
                    <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Active Account Session</span>
                        <span className="text-[11px] text-slate-400 block">Signed in as {currentUser.email}</span>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  /* Guest Mode State */
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">You Are Exploring in Guest Mode</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Create an account or sign in to save your personal candidate profile to the cloud, store private resumes, manage your password, and isolate your personal job application pipeline.
                      </p>
                    </div>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => router.push("/login")}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => router.push("/login?mode=signup")}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition"
                      >
                        Start Free Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      </div>



      {/* Smart Import / AI Parser Modal */}

      {isImportModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">

              <div className="flex items-center gap-2">

                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">

                  <Zap className="w-4 h-4" />

                </div>

                <div>

                  <h3 className="text-base font-bold text-white">Smart Job Import</h3>

                  <p className="text-[11px] text-slate-400">Paste any job URL or Job Description text</p>

                </div>

              </div>

              <button onClick={() => setIsImportModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">

                <X className="w-5 h-5" />

              </button>

            </div>



            {parseError && (

              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">

                {parseError}

              </div>

            )}



            <form onSubmit={handleParseJob} className="space-y-4 text-xs">

              <div>

                <label className="block font-semibold text-slate-300 mb-1">Job Posting URL (LinkedIn, Indeed, Careers)</label>

                <input

                  type="url"

                  value={importUrl}

                  onChange={(e) => setImportUrl(e.target.value)}

                  placeholder="https://company.com/careers/job-123"

                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-300 mb-1">Or Paste Job Description Text</label>

                <textarea

                  rows={5}

                  value={importText}

                  onChange={(e) => setImportText(e.target.value)}

                  placeholder="Paste job posting requirements, hiring manager contact, location, salary here..."

                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-sans leading-relaxed"

                />

              </div>



              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">

                <button

                  type="button"

                  onClick={() => setIsImportModalOpen(false)}

                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={isParsing || (!importText && !importUrl)}

                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 disabled:opacity-50 transition"

                >

                  {isParsing ? (

                    <>

                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Extracting Details...

                    </>

                  ) : (

                    <>

                      <Zap className="w-3.5 h-3.5 text-amber-300" /> Extract & Add Job

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* Add / Edit Job Modal */}

      {isJobModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">

              <h3 className="text-base font-bold text-white">

                {editingJob ? "Edit Job Application" : "Add New Application"}

              </h3>

              <button onClick={() => setIsJobModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">

                <X className="w-5 h-5" />

              </button>

            </div>



            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Company Name *</label>

                  <input

                    type="text"

                    required

                    value={jobForm.company}

                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}

                    placeholder="e.g. Google"

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Role Title *</label>

                  <input

                    type="text"

                    required

                    value={jobForm.role}

                    onChange={(e) => setJobForm({ ...jobForm, role: e.target.value })}

                    placeholder="e.g. SDE-2"

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>

              </div>



              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Recruiter Name</label>

                  <input

                    type="text"

                    value={jobForm.contactName}

                    onChange={(e) => setJobForm({ ...jobForm, contactName: e.target.value })}

                    placeholder="e.g. Sarah Jenkins"

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Recruiter Email</label>

                  <input

                    type="email"

                    value={jobForm.contactEmail}

                    onChange={(e) => setJobForm({ ...jobForm, contactEmail: e.target.value })}

                    placeholder="recruiter@company.com"

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>

              </div>



              <div className="grid grid-cols-3 gap-3">

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Location</label>

                  <input

                    type="text"

                    value={jobForm.location}

                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}

                    placeholder="Remote / City"

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Salary Range</label>

                  <input

                    type="text"

                    value={jobForm.salary}

                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}

                    placeholder="₹25 - ₹35 LPA"

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Status</label>

                  <select

                    value={jobForm.status}

                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value as any })}

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  >

                    <option value="wishlist">Wishlist</option>

                    <option value="applied">Cold Emailed</option>

                    <option value="interviewing">Interviewing</option>

                    <option value="offer">Offer</option>

                    <option value="rejected">Archived</option>

                  </select>

                </div>

              </div>



              <div>

                <label className="block font-semibold text-slate-300 mb-1">Job Link / Career URL</label>

                <input

                  type="url"

                  value={jobForm.jobUrl}

                  onChange={(e) => setJobForm({ ...jobForm, jobUrl: e.target.value })}

                  placeholder="https://company.com/careers/job-id"

                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-300 mb-1">Notes & Follow-up Details</label>

                <textarea

                  rows={3}

                  value={jobForm.notes}

                  onChange={(e) => setJobForm({ ...jobForm, notes: e.target.value })}

                  placeholder="Referral notes, tech stack requirements, interview tips..."

                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                />

              </div>



              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">

                <button

                  type="button"

                  onClick={() => setIsJobModalOpen(false)}

                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"

                >

                  {editingJob ? "Save Changes" : "Create Application"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* Add / Edit Template Modal */}

      {isTplModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">

              <h3 className="text-base font-bold text-white">

                {editingTpl ? "Edit Template" : "Add New Template"}

              </h3>

              <button onClick={() => setIsTplModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">

                <X className="w-5 h-5" />

              </button>

            </div>



            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Template Name *</label>

                  <input

                    type="text"

                    required

                    value={tplForm.name}

                    onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })}

                    placeholder="e.g. SDE-2 Pitch"

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>

                <div>

                  <label className="block font-semibold text-slate-300 mb-1">Category</label>

                  <input

                    type="text"

                    value={tplForm.category}

                    onChange={(e) => setTplForm({ ...tplForm, category: e.target.value })}

                    placeholder="e.g. Application, Networking"

                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                  />

                </div>

              </div>



              <div>

                <label className="block font-semibold text-slate-300 mb-1">Subject Line *</label>

                <input

                  type="text"

                  required

                  value={tplForm.subject}

                  onChange={(e) => setTplForm({ ...tplForm, subject: e.target.value })}

                  placeholder="e.g. Application: {{role}} - {{candidate_name}}"

                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"

                />

              </div>



              <div>

                <div className="flex items-center justify-between mb-1">

                  <label className="block font-semibold text-slate-300">Message Body *</label>

                  <span className="text-[10px] text-slate-500">Supports variable tags</span>

                </div>

                <textarea

                  rows={8}

                  required

                  value={tplForm.body}

                  onChange={(e) => setTplForm({ ...tplForm, body: e.target.value })}

                  placeholder="Write your email template using {{candidate_name}}, {{company}}, {{role}}, {{recruiter_name}}..."

                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-sans leading-relaxed"

                />

              </div>



              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400">

                <span className="font-bold text-slate-300 block mb-1">Available Dynamic Tags:</span>

                <code>{"{{company}}"}</code>, <code>{"{{role}}"}</code>, <code>{"{{recruiter_name}}"}</code>, <code>{"{{candidate_name}}"}</code>, <code>{"{{candidate_title}}"}</code>, <code>{"{{candidate_skills}}"}</code>, <code>{"{{candidate_experience}}"}</code>, <code>{"{{candidate_notice}}"}</code>

              </div>



              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">

                <button

                  type="button"

                  onClick={() => setIsTplModalOpen(false)}

                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"

                >

                  {editingTpl ? "Save Changes" : "Create Template"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

            </>

      )}

    </div>

  );

}
