"use client";

import React from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { useJobDashboard } from "@/hooks";
import { AppHeader, AppSidebar, MobileNav } from "@/components/layout";
import { JobTrackerView } from "@/components/features/tracker/JobTrackerView";
import { JobDiscoverView } from "@/components/features/discover/JobDiscoverView";
import { OutreachView } from "@/components/features/outreach/OutreachView";
import { TemplatesView } from "@/components/features/templates/TemplatesView";
import { ProfileView } from "@/components/features/profile/ProfileView";
import { SettingsView } from "@/components/features/settings/SettingsView";
import { SmartImportModal } from "@/components/features/tracker/SmartImportModal";
import { JobFormModal } from "@/components/features/tracker/JobFormModal";

export default function Home() {
  const {
    router,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    currentUser,
    authReady,
    jobs,
    profile,
    setProfile,
    templates,
    setTemplates,
    resumes,
    isUploadingResume,
    displayNameInput,
    setDisplayNameInput,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isUpdatingPassword,
    passwordStatus,
    uploadedFiles,
    selectedAttachment,
    setSelectedAttachment,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    discoverQuery,
    setDiscoverQuery,
    discoveredJobs,
    isSearchingJobs,
    hasSearched,
    isJobModalOpen,
    setIsJobModalOpen,
    editingJob,
    jobForm,
    setJobForm,
    isImportModalOpen,
    setIsImportModalOpen,
    importText,
    setImportText,
    importUrl,
    setImportUrl,
    isParsing,
    parseError,
    selectedJobId,
    setSelectedJobId,
    selectedTemplateId,
    recipient,
    setRecipient,
    recipientName,
    setRecipientName,
    companyName,
    setCompanyName,
    roleTitle,
    setRoleTitle,
    subject,
    setSubject,
    body,
    setBody,
    isSending,
    sendResult,
    settings,
    setSettings,
    settingsSaved,
    isCheckingConn,
    connStatus,
    isUploading,
    toastMessage,
    filteredJobs,
    inMotionCount,
    showToast,
    checkConnection,
    handleSignOut,
    handleSearchLiveJobs,
    handleTrackDiscoveredJob,
    handlePitchDiscoveredJob,
    applyTemplate,
    handleSelectJobForOutreach,
    handleSendEmail,
    handleFileUpload,
    handleUploadResumeFile,
    handleSetDefaultResume,
    handleDeleteResume,
    handleUpdatePassword,
    handleUpdateDisplayName,
    handleSaveProfile,
    handleSaveSettings,
    handleParseJob,
    handleClearAllJobs,
    handleSeedSampleJobs,
    handleSaveJob,
    updateStatus,
    handleDeleteJob,
    openAddJobModal,
    openEditJobModal,
  } = useJobDashboard();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans selection:bg-blue-600 selection:text-white">
      {!authReady || !currentUser ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
          {authReady ? "Redirecting to sign in..." : "Checking your session..."}
        </div>
      ) : (
        <>
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500/50 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Top Navbar */}
          <AppHeader
            profile={profile}
            connStatus={connStatus}
            isCheckingConn={isCheckingConn}
            onCheckConnection={checkConnection}
            onOpenProfile={() => setActiveTab("profile")}
            onQuickAdd={openAddJobModal}
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onNavigateAuth={(path) => router.push(path)}
          />

          {/* Dashboard Layout: Sidebar + Main Content */}
          <div className="flex w-full min-h-[calc(100vh-4rem)]">
            {/* Desktop Sidebar Navigation */}
            <AppSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              jobsCount={jobs.length}
              inMotionCount={inMotionCount}
              templatesCount={templates.length}
              resumesCount={resumes.length}
              profile={profile}
              connStatus={connStatus}
              onDiscoverClick={() => {
                setActiveTab("discover");
                if (discoveredJobs.length === 0) handleSearchLiveJobs();
              }}
            />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-6 pb-16 overflow-x-hidden">
              {/* Mobile Navigation */}
              <MobileNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                jobsCount={jobs.length}
                templatesCount={templates.length}
                resumesCount={resumes.length}
                onDiscoverClick={() => {
                  setActiveTab("discover");
                  if (discoveredJobs.length === 0) handleSearchLiveJobs();
                }}
              />

              {/* Tab 1: Dynamic Job Applications Tracker */}
              {activeTab === "tracker" && (
                <JobTrackerView
                  jobs={jobs}
                  filteredJobs={filteredJobs}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onOpenImportModal={() => setIsImportModalOpen(true)}
                  onOpenAddJobModal={openAddJobModal}
                  onClearAllJobs={handleClearAllJobs}
                  onUpdateStatus={updateStatus}
                  onSelectJobForOutreach={handleSelectJobForOutreach}
                  onEditJob={openEditJobModal}
                  onDeleteJob={handleDeleteJob}
                  onNavigateToDiscover={() => {
                    setActiveTab("discover");
                    if (discoveredJobs.length === 0) handleSearchLiveJobs();
                  }}
                  onSeedSampleJobs={handleSeedSampleJobs}
                />
              )}

              {/* Tab 2: Discover Live Jobs */}
              {activeTab === "discover" && (
                <JobDiscoverView
                  discoverQuery={discoverQuery}
                  onDiscoverQueryChange={setDiscoverQuery}
                  onSearchLiveJobs={handleSearchLiveJobs}
                  isSearchingJobs={isSearchingJobs}
                  discoveredJobs={discoveredJobs}
                  hasSearched={hasSearched}
                  onTrackDiscoveredJob={handleTrackDiscoveredJob}
                  onPitchDiscoveredJob={handlePitchDiscoveredJob}
                />
              )}

              {/* Tab 3: Dynamic Cold Email Outreach */}
              {activeTab === "outreach" && (
                <OutreachView
                  jobs={jobs}
                  selectedJobId={selectedJobId}
                  onSelectJob={handleSelectJobForOutreach}
                  onJobIdChange={setSelectedJobId}
                  templates={templates}
                  selectedTemplateId={selectedTemplateId}
                  onApplyTemplate={applyTemplate}
                  onNavigateToTemplates={() => setActiveTab("templates")}
                  onNavigateToProfile={() => setActiveTab("profile")}
                  sendResult={sendResult}
                  onSendEmail={handleSendEmail}
                  isSending={isSending}
                  companyName={companyName}
                  onCompanyNameChange={setCompanyName}
                  roleTitle={roleTitle}
                  onRoleTitleChange={setRoleTitle}
                  recipientName={recipientName}
                  onRecipientNameChange={setRecipientName}
                  recipient={recipient}
                  onRecipientChange={setRecipient}
                  subject={subject}
                  onSubjectChange={setSubject}
                  body={body}
                  onBodyChange={setBody}
                  settings={settings}
                  uploadedFiles={uploadedFiles}
                  selectedAttachment={selectedAttachment}
                  onSelectAttachment={setSelectedAttachment}
                  isUploading={isUploading}
                  onFileUpload={handleFileUpload}
                  profile={profile}
                />
              )}

              {/* Tab 4: Dynamic Templates Manager */}
              {activeTab === "templates" && (
                <TemplatesView
                  templates={templates}
                  onApplyTemplate={(tplId) => {
                    applyTemplate(tplId);
                    setActiveTab("outreach");
                  }}
                  onTemplatesChange={setTemplates}
                  onShowToast={showToast}
                />
              )}

              {/* Tab 5: Candidate Profile & Resumes */}
              {activeTab === "profile" && (
                <ProfileView
                  profile={profile}
                  onProfileChange={setProfile}
                  onSaveProfile={handleSaveProfile}
                  resumes={resumes}
                  onSetDefaultResume={handleSetDefaultResume}
                  onDeleteResume={handleDeleteResume}
                  onUploadResumeFile={handleUploadResumeFile}
                  isUploadingResume={isUploadingResume}
                  currentUser={currentUser}
                />
              )}

              {/* Tab 6: Dynamic APIs & Account Credentials */}
              {activeTab === "settings" && (
                <SettingsView
                  settings={settings}
                  onSettingsChange={setSettings}
                  onSaveSettings={handleSaveSettings}
                  settingsSaved={settingsSaved}
                  onCheckConnection={checkConnection}
                  isCheckingConn={isCheckingConn}
                  currentUser={currentUser}
                  profileEmail={profile.email}
                  onUpdateDisplayName={handleUpdateDisplayName}
                  displayNameInput={displayNameInput}
                  onDisplayNameInputChange={setDisplayNameInput}
                  onUpdatePassword={handleUpdatePassword}
                  newPassword={newPassword}
                  onNewPasswordChange={setNewPassword}
                  confirmPassword={confirmPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  isUpdatingPassword={isUpdatingPassword}
                  passwordStatus={passwordStatus}
                  onSignOut={handleSignOut}
                  onNavigateToLogin={(mode) =>
                    router.push(mode === "signup" ? "/login?mode=signup" : "/login")
                  }
                />
              )}
            </main>
          </div>

          {/* Smart Import / AI Parser Modal */}
          <SmartImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            importUrl={importUrl}
            onImportUrlChange={setImportUrl}
            importText={importText}
            onImportTextChange={setImportText}
            parseError={parseError}
            isParsing={isParsing}
            onParseJob={handleParseJob}
          />

          {/* Add / Edit Job Modal */}
          <JobFormModal
            isOpen={isJobModalOpen}
            onClose={() => setIsJobModalOpen(false)}
            editingJob={editingJob}
            jobForm={jobForm}
            onJobFormChange={setJobForm}
            onSaveJob={handleSaveJob}
          />
        </>
      )}
    </div>
  );
}
