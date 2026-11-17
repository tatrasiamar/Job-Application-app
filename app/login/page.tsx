"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Lock, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get("mode");
    if (mode === "signup") setAuthMode("signup");

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace("/");
        return;
      }
      setCheckingSession(false);
    });
  }, [router]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthNotice("");

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: { full_name: authFullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        if (data.session) {
          router.replace("/");
          return;
        }
        setAuthNotice("Account created. Confirm your email if asked, then sign in.");
        setAuthMode("signin");
        setAuthPassword("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        router.replace("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">JobFlow AI</h1>
            <p className="text-[11px] text-slate-400 mt-1">Sign in to your pipeline</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {checkingSession ? (
            <div className="py-16 flex flex-col items-center gap-3 text-slate-400 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              Checking your session...
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 mx-auto mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  {authMode === "signup" ? "Create Your JobFlow Account" : "Sign In to JobFlow AI"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {authMode === "signup"
                    ? "Save your applications and cold pitches to the cloud."
                    : "Access your cloud database, saved jobs, and email history."}
                </p>
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setAuthError("");
                    setAuthNotice("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                    authMode === "signin" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                    setAuthNotice("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                    authMode === "signup" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {authError}
                </div>
              )}
              {authNotice && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  {authNotice}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
                {authMode === "signup" && (
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Minimum 6 characters</span>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authenticating...
                    </>
                  ) : authMode === "signup" ? (
                    "Create Free Account"
                  ) : (
                    "Sign In to Account"
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-400">
                  {authMode === "signup" ? "Already have an account?" : "Don't have an account yet?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === "signup" ? "signin" : "signup");
                      setAuthError("");
                      setAuthNotice("");
                    }}
                    className="text-blue-400 font-semibold hover:underline ml-1"
                  >
                    {authMode === "signup" ? "Sign In" : "Sign up for free"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
