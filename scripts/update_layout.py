import re

path = r"C:\Users\user\Desktop\Job-Application-App\app\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Clean up any mangled unicode characters
replacements = {
    "â€¢": "•",
    "â€”": "—",
    "â— ": "●",
    "âœ“": "✓",
    "â‚¹": "₹",
    "Ã¢Å¡Â Ã¯Â¸Â ": "⚠️ ",
    "âš\xa0ï¸\x8f": "⚠️",
}
for k, v in replacements.items():
    content = content.replace(k, v)

# 2. Refactor Top Navbar Header
old_header_start = content.find("{/* Top Navbar */}")
old_header_end = content.find("{/* Main Container */}")

if old_header_start == -1 or old_header_end == -1:
    print("Error: Could not locate header boundaries!")
    exit(1)

new_header = '''{/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
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
                  onClick={() => { setAuthMode("signin"); setAuthError(""); setIsAuthModalOpen(true); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" /> Sign In
                </button>
                <button
                  onClick={() => { setAuthMode("signup"); setAuthError(""); setIsAuthModalOpen(true); }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Start Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      '''

content = content[:old_header_start] + new_header + content[old_header_end:]

# 3. Refactor Navigation Tabs Bar
old_nav_start = content.find("{/* Navigation Tabs */}")
old_nav_end = content.find("{/* Tab 1: Dynamic Job Applications Tracker */}")

if old_nav_start == -1 or old_nav_end == -1:
    print("Error: Could not locate Navigation Tabs boundaries!")
    exit(1)

new_nav = '''{/* Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 gap-1 sm:gap-2 mb-6 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "tracker"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Applications</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {jobs.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("discover");
              if (discoveredJobs.length === 0) handleSearchLiveJobs();
            }}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "discover"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Discover Live Jobs</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live API
            </span>
          </button>

          <button
            onClick={() => setActiveTab("outreach")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "outreach"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Cold Email Outreach</span>
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "templates"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dynamic Templates</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {templates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Candidate Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>SMTP Settings</span>
          </button>
        </div>

        '''

content = content[:old_nav_start] + new_nav + content[old_nav_end:]

# 4. Refactor Control Bar in Tracker Tab
old_ctrl_start = content.find("{/* Control Bar: Search, Filters, View Mode & Clear Action */}")
old_ctrl_end = content.find("{/* View Mode 1: Grid View */}")

if old_ctrl_start == -1 or old_ctrl_end == -1:
    print("Error: Could not locate Control Bar boundaries!")
    exit(1)

new_ctrl = '''{/* Control Bar: Search, Filters, View Mode & Action Buttons */}
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

            '''

content = content[:old_ctrl_start] + new_ctrl + content[old_ctrl_end:]

# 5. Refactor Empty State Hero
old_empty_start = content.find("{filteredJobs.length === 0 && (")
old_empty_end = content.find("{/* Tab 2: Discover Live Jobs (Real Dynamic Job Feed API) */}")

if old_empty_start != -1 and old_empty_end != -1:
    new_empty = '''{filteredJobs.length === 0 && (
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

        '''
    content = content[:old_empty_start] + new_empty + content[old_empty_end:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Update successfully written to app/page.tsx!")
