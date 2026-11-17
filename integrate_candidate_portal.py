import re

path = r"C:\Users\user\Desktop\Job-Application-App\app\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update lucide-react imports if needed
if "Download," not in text:
    text = text.replace("Lock,\n  UserCheck,", "Lock,\n  UserCheck,\n  Download,\n  Star,\n  Key,\n  Eye,\n  EyeOff,")

# 2. Add ResumeRecord interface
if "interface ResumeRecord" not in text:
    idx = text.find("interface CandidateProfile {")
    resume_interface = '''interface ResumeRecord {
  id: string;
  userId?: string;
  fileName: string;
  filePath: string;
  fileSizeKb: number;
  isDefault: boolean;
  uploadedAt: string;
  downloadUrl: string;
}

'''
    text = text[:idx] + resume_interface + text[idx:]

# 3. Add states for Resumes, Sub-tabs & Password management
if "const [resumes, setResumes]" not in text:
    target = 'const [templates, setTemplates] = useState<EmailTemplate[]>([]);'
    new_states = '''const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<"profile" | "resumes">("profile");
  const [settingsSubTab, setSettingsSubTab] = useState<"mailing" | "jobsearch" | "security">("mailing");

  // Account Security & Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);'''
    text = text.replace(target, new_states)

# 4. Update settings state with BYOK fields
if "jobSearchProvider:" not in text:
    old_settings = '''const [settings, setSettings] = useState({
    smtpHost: "smtp-relay.brevo.com",
    smtpPort: "587",
    smtpUser: "c2812c001@smtp-brevo.com",
    smtpKey: "",
    senderEmail: "tatrasiamar123@gmail.com",
    senderName: "Tatrasi Amar",
    replyToEmail: "tatrasiamar123@gmail.com",
    replyToName: "Tatrasi Amar",
  });'''

    new_settings = '''const [settings, setSettings] = useState({
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
  });'''
    text = text.replace(old_settings, new_settings)

# 5. Update fetchAllData to fetch resumes
old_fetch = '''const [resJobs, resProfile, resTemplates, resFiles, resSettings] = await Promise.all([
        fetch(`/api/jobs${queryParam}`).then((r) => r.json()),
        fetch(`/api/profile${queryParam}`).then((r) => r.json()),
        fetch(`/api/templates${queryParam}`).then((r) => r.json()),
        fetch("/api/upload").then((r) => r.json()),
        fetch(`/api/settings${queryParam}`).then((r) => r.json()),
      ]);'''

new_fetch = '''const [resJobs, resProfile, resTemplates, resResumes, resSettings] = await Promise.all([
        fetch(`/api/jobs${queryParam}`).then((r) => r.json()),
        fetch(`/api/profile${queryParam}`).then((r) => r.json()),
        fetch(`/api/templates${queryParam}`).then((r) => r.json()),
        fetch(`/api/resumes${queryParam}`).then((r) => r.json()),
        fetch(`/api/settings${queryParam}`).then((r) => r.json()),
      ]);'''

if old_fetch in text:
    text = text.replace(old_fetch, new_fetch)
    # Also update processing of resFiles -> resResumes
    old_proc = '''if (resFiles.success && Array.isArray(resFiles.files)) {
        setUploadedFiles(resFiles.files);
        if (resFiles.files.length > 0) {
          setSelectedAttachment(resFiles.files[0].filename);
        }
      }'''
    new_proc = '''if (resResumes.success && Array.isArray(resResumes.resumes)) {
        setResumes(resResumes.resumes);
        const def = resResumes.resumes.find((r: any) => r.isDefault) || resResumes.resumes[0];
        if (def) {
          setSelectedAttachment(def.fileName);
        }
      }'''
    text = text.replace(old_proc, new_proc)

# 6. Add handlers for Resume Management and Password Update
if "const handleUploadResumeFile" not in text:
    anchor = "const handleSaveProfile = async (e: React.FormEvent) => {"
    handlers = '''  // Resume Management Handlers
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

'''
    text = text.replace(anchor, handlers + anchor)

# 7. Update handleSaveProfile to include userId
old_save_prof = '''    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });'''
new_save_prof = '''    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, userId: currentUser?.id }),
      });'''
text = text.replace(old_save_prof, new_save_prof)

# 8. Update handleSaveSettings to include userId
old_save_sett = '''    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });'''
new_save_sett = '''    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, userId: currentUser?.id }),
      });'''
text = text.replace(old_save_sett, new_save_sett)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Step 1 of integration complete: Handlers and states injected.")
