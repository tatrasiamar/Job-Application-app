"use client";

import React from "react";
import {
  Briefcase,
  Globe,
  Send,
  Sparkles,
  User,
  Key,
  ChevronRight,
} from "lucide-react";
import { CandidateProfile, NavigationTab } from "@/types";

interface AppSidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  jobsCount: number;
  inMotionCount: number;
  templatesCount: number;
  resumesCount: number;
  profile: CandidateProfile;
  connStatus: { connected: boolean; latencyMs?: number } | null;
  onDiscoverClick: () => void;
}

export function AppSidebar({
  activeTab,
  setActiveTab,
  jobsCount,
  inMotionCount,
  templatesCount,
  resumesCount,
  profile,
  connStatus,
  onDiscoverClick,
}: AppSidebarProps) {
  return (
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
                <Briefcase
                  className={`w-4 h-4 ${
                    activeTab === "tracker" ? "text-blue-400" : "text-slate-400"
                  }`}
                />
                <span>Job Applications</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
                {jobsCount}
              </span>
            </button>

            {/* 2. Discover Live Jobs */}
            <button
              onClick={onDiscoverClick}
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
                <Send
                  className={`w-4 h-4 ${
                    activeTab === "outreach" ? "text-blue-400" : "text-slate-400"
                  }`}
                />
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
                <Sparkles
                  className={`w-4 h-4 ${
                    activeTab === "templates" ? "text-amber-400" : "text-slate-400"
                  }`}
                />
                <span>Dynamic Templates</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
                {templatesCount}
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
                <User
                  className={`w-4 h-4 ${
                    activeTab === "profile" ? "text-blue-400" : "text-slate-400"
                  }`}
                />
                <span>Profile & Resumes</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
                {resumesCount}
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
                <Key
                  className={`w-4 h-4 ${
                    activeTab === "settings" ? "text-blue-400" : "text-slate-400"
                  }`}
                />
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
              <div className="text-lg font-bold text-white">{jobsCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Tracked</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-lg font-bold text-emerald-400">
                {inMotionCount}
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
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connStatus?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            {connStatus?.connected
              ? `Relay Online (${connStatus.latencyMs}ms)`
              : "SMTP Offline"}
          </span>
          <span>v2.4 SaaS</span>
        </div>
      </div>
    </aside>
  );
}
