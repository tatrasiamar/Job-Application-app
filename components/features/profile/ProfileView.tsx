import React, { useState } from "react";
import {
  User,
  FileText,
  Upload,
  ExternalLink,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { CandidateProfile, ResumeRecord } from "@/types";

interface ProfileViewProps {
  profile: CandidateProfile;
  onProfileChange: (updater: (prev: CandidateProfile) => CandidateProfile) => void;
  onSaveProfile: (e: React.FormEvent) => Promise<void>;
  resumes: ResumeRecord[];
  onSetDefaultResume: (id: string) => Promise<void>;
  onDeleteResume: (id: string, fileName: string) => Promise<void>;
  onUploadResumeFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploadingResume: boolean;
  currentUser?: any;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onProfileChange,
  onSaveProfile,
  resumes,
  onSetDefaultResume,
  onDeleteResume,
  onUploadResumeFile,
  isUploadingResume,
  currentUser,
}) => {
  const [profileSubTab, setProfileSubTab] = useState<"profile" | "resumes">("profile");

  return (
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

          <form onSubmit={onSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, name: e.target.value }))}
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
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, title: e.target.value }))}
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
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, email: e.target.value }))}
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
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, location: e.target.value }))}
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
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                  placeholder="e.g. 2 years"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notice Period / Availability</label>
                <input
                  type="text"
                  value={profile.noticePeriod}
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, noticePeriod: e.target.value }))}
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
                onChange={(e) => onProfileChange((prev) => ({ ...prev, skills: e.target.value }))}
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
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  value={profile.githubUrl || ""}
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, githubUrl: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Portfolio / Personal Website</label>
                <input
                  type="url"
                  value={profile.portfolioUrl || ""}
                  onChange={(e) => onProfileChange((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
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
                onChange={(e) => onProfileChange((prev) => ({ ...prev, bio: e.target.value }))}
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
                onChange={onUploadResumeFile}
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
                          onClick={() => onSetDefaultResume(r.id)}
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
                        onClick={() => onDeleteResume(r.id, r.fileName)}
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
  );
};
