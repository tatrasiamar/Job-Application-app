import React from "react";
import {
  Briefcase,
  Send,
  Clock,
  CheckCircle2,
  Mail,
  Search,
  LayoutGrid,
  Columns,
  Zap,
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  DollarSign,
  Edit3,
  Compass,
  Globe,
} from "lucide-react";
import { JobApplication, JobStatus } from "@/types";

interface JobTrackerViewProps {
  jobs: JobApplication[];
  filteredJobs: JobApplication[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: "grid" | "kanban";
  onViewModeChange: (mode: "grid" | "kanban") => void;
  onOpenImportModal: () => void;
  onOpenAddJobModal: () => void;
  onClearAllJobs: () => Promise<void>;
  onUpdateStatus: (job: JobApplication, newStatus: JobStatus) => Promise<void>;
  onSelectJobForOutreach: (job: JobApplication) => void;
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (id: string) => Promise<void>;
  onNavigateToDiscover: () => void;
  onSeedSampleJobs: () => Promise<void>;
}

const KANBAN_STAGES: Array<{ id: JobStatus; label: string; color: string }> = [
  { id: "wishlist", label: "Wishlist", color: "border-slate-700 text-slate-300" },
  { id: "applied", label: "Cold Emailed", color: "border-blue-500/50 text-blue-400" },
  { id: "interviewing", label: "Interviewing", color: "border-amber-500/50 text-amber-400" },
  { id: "offer", label: "Offer Received", color: "border-emerald-500/50 text-emerald-400" },
  { id: "rejected", label: "Archived", color: "border-red-500/50 text-red-400" },
];

export const JobTrackerView: React.FC<JobTrackerViewProps> = ({
  jobs,
  filteredJobs,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onOpenImportModal,
  onOpenAddJobModal,
  onClearAllJobs,
  onUpdateStatus,
  onSelectJobForOutreach,
  onEditJob,
  onDeleteJob,
  onNavigateToDiscover,
  onSeedSampleJobs,
}) => {
  const appliedCount = jobs.filter((j) => j.status === "applied").length;
  const interviewingCount = jobs.filter((j) => j.status === "interviewing").length;
  const offerCount = jobs.filter((j) => j.status === "offer").length;
  const totalEmailsSent = jobs.reduce(
    (acc, j) => acc + (j.emailHistory ? j.emailHistory.length : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Pipeline Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Tracked Jobs</span>
            <span className="text-xl font-bold text-white">{jobs.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Cold Emailed</span>
            <span className="text-xl font-bold text-blue-400">{appliedCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Send className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Interviewing</span>
            <span className="text-xl font-bold text-amber-400">{interviewingCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Offers</span>
            <span className="text-xl font-bold text-emerald-400">{offerCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Outreach Sent</span>
            <span className="text-xl font-bold text-indigo-400">{totalEmailsSent}</span>
          </div>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Mail className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Mode & Action Buttons */}
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
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange("")}
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
                onClick={() => onStatusFilterChange(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {s === "all"
                  ? `All (${jobs.length})`
                  : `${s === "applied" ? "Cold Emailed" : s === "rejected" ? "Archived" : s} (${
                      jobs.filter((j) => j.status === s).length
                    })`}
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
                onClick={() => onViewModeChange("grid")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => onViewModeChange("kanban")}
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
              onClick={onOpenImportModal}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
              title="Automatically extract company, role, and recruiter from any Job URL or text"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Import</span>
            </button>

            <button
              onClick={onOpenAddJobModal}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </button>

            {jobs.length > 0 && (
              <button
                onClick={onClearAllJobs}
                className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30 text-xs font-medium transition"
                title="Clear All Applications from Database"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Mode 1: Grid View */}
      {viewMode === "grid" && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition flex items-center gap-2">
                      {job.company}
                      {job.jobUrl && (
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </h3>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">{job.role}</p>
                  </div>

                  <select
                    value={job.status}
                    onChange={(e) => onUpdateStatus(job, e.target.value as JobStatus)}
                    className="bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1 text-slate-300 outline-none cursor-pointer focus:border-blue-500 font-medium"
                  >
                    <option value="wishlist">Wishlist</option>
                    <option value="applied">Cold Emailed</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer Received</option>
                    <option value="rejected">Archived</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-3">
                  {job.location && (
                    <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      <MapPin className="w-3 h-3 text-slate-500" /> {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-mono">
                      <DollarSign className="w-3 h-3" /> {job.salary}
                    </span>
                  )}
                </div>

                {job.contactEmail && (
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 mb-3 text-xs">
                    <span className="text-slate-500 block mb-0.5 font-medium">Recruiter / Contact:</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-medium truncate">
                        {job.contactName ? `${job.contactName} (${job.contactEmail})` : job.contactEmail}
                      </span>
                      {job.emailHistory && job.emailHistory.length > 0 && (
                        <span className="text-blue-400 text-xs flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> {job.emailHistory.length} sent
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {job.notes && (
                  <p className="text-xs text-slate-400 italic line-clamp-2 mb-3 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                    "{job.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectJobForOutreach(job)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  {job.emailHistory && job.emailHistory.length > 0 ? "Follow Up" : "Send Cold Email"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditJob(job)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                    title="Edit Job Application"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteJob(job.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
                    title="Delete Application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Mode 2: Kanban Stages Board */}
      {viewMode === "kanban" && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((stage) => {
            const stageJobs = filteredJobs.filter((j) => j.status === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-w-[220px]"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className={`text-xs font-bold ${stage.color}`}>{stage.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-400">
                    {stageJobs.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {stageJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition"
                    >
                      <h4 className="text-xs font-bold text-white truncate">{job.company}</h4>
                      <p className="text-[11px] text-slate-400 truncate mb-2">{job.role}</p>

                      {job.contactEmail && (
                        <p className="text-[10px] text-slate-500 truncate mb-2">{job.contactEmail}</p>
                      )}

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                        <button
                          onClick={() => onSelectJobForOutreach(job)}
                          className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Send className="w-2.5 h-2.5" /> Pitch
                        </button>

                        {/* Advance Stage Shortcuts */}
                        {stage.id === "wishlist" && (
                          <button
                            onClick={() => onUpdateStatus(job, "applied")}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                            title="Mark as Cold Emailed"
                          >
                            Applied &rarr;
                          </button>
                        )}
                        {stage.id === "applied" && (
                          <button
                            onClick={() => onUpdateStatus(job, "interviewing")}
                            className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                            title="Move to Interviewing"
                          >
                            Interview &rarr;
                          </button>
                        )}
                        {stage.id === "interviewing" && (
                          <button
                            onClick={() => onUpdateStatus(job, "offer")}
                            className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                            title="Offer Received"
                          >
                            Offer!
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
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
              onClick={onNavigateToDiscover}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition"
            >
              <Globe className="w-4 h-4" /> Discover Live Jobs (API)
            </button>
            <button
              onClick={onOpenImportModal}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition"
            >
              <Zap className="w-4 h-4 text-amber-400" /> Smart Import URL/Text
            </button>
            <button
              onClick={onOpenAddJobModal}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-emerald-400" /> Add Application
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800/60">
            <button
              onClick={onSeedSampleJobs}
              className="text-xs text-slate-500 hover:text-slate-300 underline transition"
            >
              Need test data? Load 2 clean sample jobs for demonstration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
