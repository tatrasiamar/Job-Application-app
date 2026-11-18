"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  EmailHistory,
  JobApplication,
  DiscoveredJob,
  AppSettings,
  ResumeRecord,
  CandidateProfile,
  EmailTemplate,
  UploadedFile,
  NavigationTab,
} from "@/types";

export function useJobDashboard() {

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




  const inMotionCount = jobs.filter(
    (j) => j.status === "applied" || j.status === "interviewing" || j.status === "offer"
  ).length;

  const openAddJobModal = () => {
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
  };

  const openEditJobModal = (job: JobApplication) => {
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
  };

  return {
    router,
    activeTab,
    setActiveTab: setActiveTab as (tab: NavigationTab) => void,
    viewMode,
    setViewMode,
    currentUser,
    setCurrentUser,
    authReady,
    jobs,
    setJobs,
    profile,
    setProfile,
    templates,
    setTemplates,
    resumes,
    setResumes,
    isUploadingResume,
    profileSubTab,
    setProfileSubTab,
    settingsSubTab,
    setSettingsSubTab,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    displayNameInput,
    setDisplayNameInput,
    passwordStatus,
    isUpdatingPassword,
    uploadedFiles,
    selectedAttachment,
    setSelectedAttachment,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    discoverQuery,
    setDiscoverQuery,
    discoveredJobs,
    isSearchingJobs,
    hasSearched,
    isJobModalOpen,
    setIsJobModalOpen,
    editingJob,
    setEditingJob,
    jobForm,
    setJobForm,
    isImportModalOpen,
    setIsImportModalOpen,
    importText,
    setImportText,
    importUrl,
    setImportUrl,
    isParsing,
    parseError,
    isTplModalOpen,
    setIsTplModalOpen,
    editingTpl,
    setEditingTpl,
    tplForm,
    setTplForm,
    selectedJobId,
    setSelectedJobId,
    selectedTemplateId,
    setSelectedTemplateId,
    recipient,
    setRecipient,
    recipientName,
    setRecipientName,
    companyName,
    setCompanyName,
    roleTitle,
    setRoleTitle,
    subject,
    setSubject,
    body,
    setBody,
    attachResume,
    setAttachResume,
    isSending,
    sendResult,
    settings,
    setSettings,
    settingsSaved,
    isCheckingConn,
    connStatus,
    isUploading,
    toastMessage,
    totalEmailsSent,
    interviewingCount,
    appliedCount,
    offerCount,
    filteredJobs,
    KANBAN_STAGES,
    inMotionCount,
    showToast,
    fetchAllData,
    checkConnection,
    handleSignOut,
    handleSearchLiveJobs,
    handleTrackDiscoveredJob,
    handlePitchDiscoveredJob,
    interpolate,
    applyTemplate,
    handleSelectJobForOutreach,
    handleSendEmail,
    handleFileUpload,
    handleUploadResumeFile,
    handleSetDefaultResume,
    handleDeleteResume,
    handleUpdatePassword,
    handleUpdateDisplayName,
    handleSaveProfile,
    handleSaveSettings,
    handleParseJob,
    handleClearAllJobs,
    handleSeedSampleJobs,
    handleSaveJob,
    handleSaveTemplate,
    handleDeleteTemplate,
    updateStatus,
    handleDeleteJob,
    openAddJobModal,
    openEditJobModal,
  };
}
