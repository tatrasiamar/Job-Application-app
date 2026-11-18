import re

path = r"C:\Users\user\Desktop\Job-Application-App\app\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Locate profile and settings blocks
prof_start = text.find('{activeTab === "profile" && (')
main_end = text.find("</main>")

if prof_start == -1 or main_end == -1:
    print("Error: Could not find profile or main end!")
    exit(1)

# Also update chosenFile in handleSendEmail
text = text.replace(
    "const chosenFile = uploadedFiles.find((f) => f.filename === selectedAttachment);",
    "const chosenFile = resumes.find((r) => r.fileName === selectedAttachment) || uploadedFiles.find((f) => f.filename === selectedAttachment);"
)

# Also update the resume selector in Cold Email Outreach Tab
old_resume_selector = '''                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.filename}
                        onClick={() => setSelectedAttachment(file.filename)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                          selectedAttachment === file.filename
                            ? "bg-blue-600/15 border-blue-500/40 text-blue-200"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium truncate max-w-[180px]">{file.filename}</span>
                          <span className="text-[10px] text-slate-500">({file.sizeKb} KB)</span>
                        </div>
                        {selectedAttachment === file.filename && (
                          <span className="text-[10px] text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                            Attached
                          </span>
                        )}
                      </div>
                    ))}
                  </div>'''

new_resume_selector = '''                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {(resumes.length > 0 ? resumes : uploadedFiles.map(f => ({ id: f.filename, fileName: f.filename, fileSizeKb: f.sizeKb, isDefault: true, downloadUrl: "" }))).map((file: any) => (
                      <div
                        key={file.id || file.fileName}
                        onClick={() => setSelectedAttachment(file.fileName)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                          selectedAttachment === file.fileName
                            ? "bg-blue-600/15 border-blue-500/40 text-blue-200"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium truncate max-w-[200px]">{file.fileName}</span>
                          <span className="text-[10px] text-slate-500">({file.fileSizeKb} KB)</span>
                          {file.isDefault && (
                            <span className="text-[9px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                              Default
                            </span>
                          )}
                        </div>
                        {selectedAttachment === file.fileName && (
                          <span className="text-[10px] text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                            Attached
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Manage or upload more in Candidate Profile.</span>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("profile"); setProfileSubTab("resumes"); }}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Resume Center &rarr;
                    </button>
                  </div>'''

if old_resume_selector in text:
    text = text.replace(old_resume_selector, new_resume_selector)
    print("Replaced resume selector in Outreach tab.")

# New complete Tab 5 and Tab 6 JSX
new_tabs_jsx = '''{activeTab === "profile" && (
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

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
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
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
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
                        onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="e.g. 2 years"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Notice Period / Availability</label>
                      <input
                        type="text"
                        value={profile.noticePeriod}
                        onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })}
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
                      onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
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
                        onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
                      <input
                        type="url"
                        value={profile.githubUrl || ""}
                        onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Portfolio / Personal Website</label>
                      <input
                        type="url"
                        value={profile.portfolioUrl || ""}
                        onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
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
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
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
                      onChange={handleUploadResumeFile}
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
                                onClick={() => handleSetDefaultResume(r.id)}
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
                              onClick={() => handleDeleteResume(r.id, r.fileName)}
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
        )}

        {/* Tab 6: Dynamic APIs & Account Credentials */}
        {activeTab === "settings" && (
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
                      setSettings({
                        ...settings,
                        smtpHost: "smtp.gmail.com",
                        smtpPort: "465",
                        smtpUser: profile.email || "tatrasiamar123@gmail.com",
                        senderEmail: profile.email || "tatrasiamar123@gmail.com",
                        replyToEmail: profile.email || "tatrasiamar123@gmail.com",
                      });
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
                      setSettings({
                        ...settings,
                        smtpHost: "smtp-relay.brevo.com",
                        smtpPort: "587",
                        smtpUser: "c2812c001@smtp-brevo.com",
                        smtpKey: "",
                        senderEmail: "tatrasiamar123@gmail.com",
                        replyToEmail: "tatrasiamar123@gmail.com",
                      });
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

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-300 mb-1">SMTP Host Server</label>
                      <input
                        type="text"
                        value={settings.smtpHost}
                        onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
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
                        onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
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
                        onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
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
                        onChange={(e) => setSettings({ ...settings, smtpKey: e.target.value })}
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
                        onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
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
                        onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
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
                          onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
                          placeholder="yourname@gmail.com"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Reply-To Name</label>
                        <input
                          type="text"
                          value={settings.replyToName || ""}
                          onChange={(e) => setSettings({ ...settings, replyToName: e.target.value })}
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
                      onClick={checkConnection}
                      disabled={isCheckingConn}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-2 transition"
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

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  {/* Provider 1: Built-in Open Tech Feeds */}
                  <div
                    onClick={() => setSettings({ ...settings, jobSearchProvider: "open_apis" })}
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
                    onClick={() => setSettings({ ...settings, jobSearchProvider: "rapidapi_jsearch" })}
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
                          onChange={(e) => setSettings({ ...settings, rapidapiKey: e.target.value })}
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
                    onClick={() => setSettings({ ...settings, jobSearchProvider: "adzuna" })}
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
                            onChange={(e) => setSettings({ ...settings, adzunaAppId: e.target.value })}
                            placeholder="Your Adzuna App ID"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-200 mb-1">Adzuna App Key</label>
                          <input
                            type="password"
                            value={settings.adzunaAppKey || ""}
                            onChange={(e) => setSettings({ ...settings, adzunaAppKey: e.target.value })}
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
                      <form onSubmit={handleUpdateDisplayName} className="pt-2 space-y-3">
                        <label className="block text-xs font-semibold text-slate-300">Update Account Display Name</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={displayNameInput || (currentUser.user_metadata?.full_name || "")}
                            onChange={(e) => setDisplayNameInput(e.target.value)}
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

                      <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs max-w-md">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        onClick={handleSignOut}
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
                        onClick={() => { setAuthMode("signin"); setAuthError(""); setIsAuthModalOpen(true); }}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => { setAuthMode("signup"); setAuthError(""); setIsAuthModalOpen(true); }}
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
        )}
'''

# Replace from prof_start to main_end with new_tabs_jsx
text = text[:prof_start] + new_tabs_jsx + text[main_end:]

# Update the main navigation tab buttons (Tab 5 and Tab 6 labels)
old_tab_profile = '''<button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Candidate Profile</span>
          </button>'''

new_tab_profile = '''<button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Candidate Profile & Resumes</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {resumes.length}
            </span>
          </button>'''

old_tab_settings = '''<button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>SMTP Settings</span>
          </button>'''

new_tab_settings = '''<button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition rounded-t-xl ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>APIs & Account</span>
          </button>'''

if old_tab_profile in text:
    text = text.replace(old_tab_profile, new_tab_profile)
    print("Updated Tab 5 nav button.")
if old_tab_settings in text:
    text = text.replace(old_tab_settings, new_tab_settings)
    print("Updated Tab 6 nav button.")

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Step 2 complete: Candidate Profile, Resume Center, BYO APIs, and Password Management injected!")
