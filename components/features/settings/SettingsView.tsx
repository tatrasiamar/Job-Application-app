import React, { useState } from "react";
import {
  Mail,
  Server,
  Globe,
  Key,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { AppSettings } from "@/types";

interface SettingsViewProps {
  settings: AppSettings;
  onSettingsChange: (updater: (prev: AppSettings) => AppSettings) => void;
  onSaveSettings: (e: React.FormEvent) => Promise<void>;
  settingsSaved: boolean;
  onCheckConnection: () => Promise<void>;
  isCheckingConn: boolean;
  currentUser?: any;
  profileEmail?: string;
  onUpdateDisplayName: (e: React.FormEvent) => Promise<void>;
  displayNameInput: string;
  onDisplayNameInputChange: (val: string) => void;
  onUpdatePassword: (e: React.FormEvent) => Promise<void>;
  newPassword: string;
  onNewPasswordChange: (val: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (val: string) => void;
  isUpdatingPassword: boolean;
  passwordStatus: { type: "success" | "error"; message: string } | null;
  onSignOut: () => Promise<void>;
  onNavigateToLogin: (mode?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsChange,
  onSaveSettings,
  settingsSaved,
  onCheckConnection,
  isCheckingConn,
  currentUser,
  profileEmail,
  onUpdateDisplayName,
  displayNameInput,
  onDisplayNameInputChange,
  onUpdatePassword,
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  isUpdatingPassword,
  passwordStatus,
  onSignOut,
  onNavigateToLogin,
}) => {
  const [settingsSubTab, setSettingsSubTab] = useState<"mailing" | "jobsearch" | "security">("mailing");

  return (
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
                onSettingsChange((prev) => ({
                  ...prev,
                  smtpHost: "smtp.gmail.com",
                  smtpPort: "465",
                  smtpUser: profileEmail || "tatrasiamar123@gmail.com",
                  senderEmail: profileEmail || "tatrasiamar123@gmail.com",
                  replyToEmail: profileEmail || "tatrasiamar123@gmail.com",
                }));
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
                onSettingsChange((prev) => ({
                  ...prev,
                  smtpHost: "smtp-relay.brevo.com",
                  smtpPort: "587",
                  smtpUser: "c2812c001@smtp-brevo.com",
                  smtpKey: "",
                  senderEmail: "tatrasiamar123@gmail.com",
                  replyToEmail: "tatrasiamar123@gmail.com",
                }));
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

          <form onSubmit={onSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">SMTP Host Server</label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => onSettingsChange((prev) => ({ ...prev, smtpHost: e.target.value }))}
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
                  onChange={(e) => onSettingsChange((prev) => ({ ...prev, smtpPort: e.target.value }))}
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
                  onChange={(e) => onSettingsChange((prev) => ({ ...prev, smtpUser: e.target.value }))}
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
                  onChange={(e) => onSettingsChange((prev) => ({ ...prev, smtpKey: e.target.value }))}
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
                  onChange={(e) => onSettingsChange((prev) => ({ ...prev, senderEmail: e.target.value }))}
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
                  onChange={(e) => onSettingsChange((prev) => ({ ...prev, senderName: e.target.value }))}
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
                    onChange={(e) => onSettingsChange((prev) => ({ ...prev, replyToEmail: e.target.value }))}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Reply-To Name</label>
                  <input
                    type="text"
                    value={settings.replyToName || ""}
                    onChange={(e) => onSettingsChange((prev) => ({ ...prev, replyToName: e.target.value }))}
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
                onClick={onCheckConnection}
                disabled={isCheckingConn}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-2 transition disabled:opacity-50"
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

          <form onSubmit={onSaveSettings} className="space-y-4 text-xs">
            {/* Provider 1: Built-in Open Tech Feeds */}
            <div
              onClick={() => onSettingsChange((prev) => ({ ...prev, jobSearchProvider: "open_apis" }))}
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
              onClick={() => onSettingsChange((prev) => ({ ...prev, jobSearchProvider: "rapidapi_jsearch" }))}
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
                    onChange={(e) => onSettingsChange((prev) => ({ ...prev, rapidapiKey: e.target.value }))}
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
              onClick={() => onSettingsChange((prev) => ({ ...prev, jobSearchProvider: "adzuna" }))}
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
                      onChange={(e) => onSettingsChange((prev) => ({ ...prev, adzunaAppId: e.target.value }))}
                      placeholder="Your Adzuna App ID"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Adzuna App Key</label>
                    <input
                      type="password"
                      value={settings.adzunaAppKey || ""}
                      onChange={(e) => onSettingsChange((prev) => ({ ...prev, adzunaAppKey: e.target.value }))}
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
                <form onSubmit={onUpdateDisplayName} className="pt-2 space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">Update Account Display Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={displayNameInput || (currentUser.user_metadata?.full_name || "")}
                      onChange={(e) => onDisplayNameInputChange(e.target.value)}
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

                <form onSubmit={onUpdatePassword} className="space-y-4 text-xs max-w-md">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => onNewPasswordChange(e.target.value)}
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
                      onChange={(e) => onConfirmPasswordChange(e.target.value)}
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
                  onClick={onSignOut}
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
                  onClick={() => onNavigateToLogin()}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigateToLogin("signup")}
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
  );
};
