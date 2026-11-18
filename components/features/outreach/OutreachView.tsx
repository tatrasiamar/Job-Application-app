import React from "react";
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Mail,
  RefreshCw,
  Send,
  Paperclip,
  FileText,
  Upload,
  User,
} from "lucide-react";
import {
  JobApplication,
  EmailTemplate,
  UploadedFile,
  CandidateProfile,
  AppSettings,
} from "@/types";

interface OutreachViewProps {
  jobs: JobApplication[];
  selectedJobId: string;
  onSelectJob: (job: JobApplication) => void;
  onJobIdChange: (id: string) => void;
  templates: EmailTemplate[];
  selectedTemplateId: string;
  onApplyTemplate: (
    tplId: string,
    company?: string,
    role?: string,
    recruiter?: string
  ) => void;
  onNavigateToTemplates: () => void;
  onNavigateToProfile: () => void;
  sendResult: { type: "success" | "error"; message: string } | null;
  onSendEmail: (e: React.FormEvent) => Promise<void>;
  isSending: boolean;
  companyName: string;
  onCompanyNameChange: (val: string) => void;
  roleTitle: string;
  onRoleTitleChange: (val: string) => void;
  recipientName: string;
  onRecipientNameChange: (val: string) => void;
  recipient: string;
  onRecipientChange: (val: string) => void;
  subject: string;
  onSubjectChange: (val: string) => void;
  body: string;
  onBodyChange: (val: string) => void;
  settings: AppSettings;
  uploadedFiles: UploadedFile[];
  selectedAttachment: string;
  onSelectAttachment: (filename: string) => void;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  profile: CandidateProfile;
}

export const OutreachView: React.FC<OutreachViewProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
  onJobIdChange,
  templates,
  selectedTemplateId,
  onApplyTemplate,
  onNavigateToTemplates,
  onNavigateToProfile,
  sendResult,
  onSendEmail,
  isSending,
  companyName,
  onCompanyNameChange,
  roleTitle,
  onRoleTitleChange,
  recipientName,
  onRecipientNameChange,
  recipient,
  onRecipientChange,
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  settings,
  uploadedFiles,
  selectedAttachment,
  onSelectAttachment,
  isUploading,
  onFileUpload,
  profile,
}) => {
  return (
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
              if (found) onSelectJob(found);
              else onJobIdChange(e.target.value);
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
              onClick={onNavigateToTemplates}
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
                onClick={() => onApplyTemplate(tpl.id)}
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
        <form onSubmit={onSendEmail} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
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
                  onCompanyNameChange(e.target.value);
                  if (selectedTemplateId)
                    onApplyTemplate(selectedTemplateId, e.target.value, roleTitle, recipientName);
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
                  onRoleTitleChange(e.target.value);
                  if (selectedTemplateId)
                    onApplyTemplate(selectedTemplateId, companyName, e.target.value, recipientName);
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
                  onRecipientNameChange(e.target.value);
                  if (selectedTemplateId)
                    onApplyTemplate(selectedTemplateId, companyName, roleTitle, e.target.value);
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
                onChange={(e) => onRecipientChange(e.target.value)}
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
              onChange={(e) => onSubjectChange(e.target.value)}
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
              onChange={(e) => onBodyChange(e.target.value)}
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
                onClick={() => onSelectAttachment(file.filename)}
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
              <input type="file" accept=".pdf,.docx,.doc" onChange={onFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Dynamic Profile Snippet */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" /> Active Candidate
            </h4>
            <button onClick={onNavigateToProfile} className="text-xs text-blue-400 hover:underline">
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
  );
};
