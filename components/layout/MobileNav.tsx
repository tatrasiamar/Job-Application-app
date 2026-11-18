"use client";

import React from "react";
import {
  Briefcase,
  Globe,
  Send,
  Sparkles,
  User,
  Key,
} from "lucide-react";
import { NavigationTab } from "@/types";

interface MobileNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  jobsCount: number;
  templatesCount: number;
  resumesCount: number;
  onDiscoverClick: () => void;
}

export function MobileNav({
  activeTab,
  setActiveTab,
  jobsCount,
  templatesCount,
  resumesCount,
  onDiscoverClick,
}: MobileNavProps) {
  return (
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
        <span>Jobs ({jobsCount})</span>
      </button>

      <button
        onClick={onDiscoverClick}
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
        <span>Templates ({templatesCount})</span>
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
        <span>Profile ({resumesCount})</span>
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
  );
}
