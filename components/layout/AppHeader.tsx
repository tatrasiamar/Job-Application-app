"use client";

import React from "react";
import {
  Briefcase,
  Edit3,
  RefreshCw,
  Plus,
  LogOut,
  LogIn,
  Sparkles,
} from "lucide-react";
import { CandidateProfile } from "@/types";

interface AppHeaderProps {
  profile: CandidateProfile;
  connStatus: { connected: boolean; latencyMs?: number; message?: string } | null;
  isCheckingConn: boolean;
  onCheckConnection: () => void;
  onOpenProfile: () => void;
  onQuickAdd: () => void;
  currentUser: any;
  onSignOut: () => void;
  onNavigateAuth: (path: string) => void;
}

export function AppHeader({
  profile,
  connStatus,
  isCheckingConn,
  onCheckConnection,
  onOpenProfile,
  onQuickAdd,
  currentUser,
  onSignOut,
  onNavigateAuth,
}: AppHeaderProps) {
  return (
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
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-300 cursor-pointer transition group mt-0.5"
              title="Click to edit candidate profile"
            >
              <span className="font-semibold text-slate-300 flex-shrink-0">
                {profile.name || "Tatrasi Amar"}
              </span>
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
            onClick={onCheckConnection}
            disabled={isCheckingConn}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
              connStatus?.connected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
            }`}
            title="Click to test SMTP Relay"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connStatus?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <RefreshCw className={`w-3 h-3 ${isCheckingConn ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">
              {connStatus?.connected
                ? `Relay Online (${connStatus.latencyMs}ms)`
                : "Test SMTP"}
            </span>
            <span className="sm:hidden">
              {connStatus?.connected ? "Online" : "Test"}
            </span>
          </button>

          {/* Quick Add CTA */}
          <button
            onClick={onQuickAdd}
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
                {currentUser.user_metadata?.full_name
                  ? currentUser.user_metadata.full_name[0].toUpperCase()
                  : currentUser.email
                  ? currentUser.email[0].toUpperCase()
                  : "U"}
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-semibold text-white block leading-none truncate max-w-[120px]">
                  {currentUser.user_metadata?.full_name ||
                    currentUser.email?.split("@")[0]}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />{" "}
                  Cloud Synced
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-slate-800">
              <button
                onClick={() => onNavigateAuth("/login")}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" /> Sign In
              </button>
              <button
                onClick={() => onNavigateAuth("/login?mode=signup")}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Start Free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
