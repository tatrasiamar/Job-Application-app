import React from "react";
import {
  Globe,
  Search,
  RefreshCw,
  ExternalLink,
  MapPin,
  DollarSign,
  BookmarkPlus,
  Send,
} from "lucide-react";
import { DiscoveredJob } from "@/types";

interface JobDiscoverViewProps {
  discoverQuery: string;
  onDiscoverQueryChange: (query: string) => void;
  onSearchLiveJobs: (overrideQuery?: string) => Promise<void>;
  isSearchingJobs: boolean;
  discoveredJobs: DiscoveredJob[];
  hasSearched: boolean;
  onTrackDiscoveredJob: (job: DiscoveredJob) => Promise<void>;
  onPitchDiscoveredJob: (job: DiscoveredJob) => void;
}

const PRESET_TAGS = [
  "Java",
  "Spring Boot",
  "React",
  "Full Stack",
  "Backend",
  "Frontend",
  "Remote",
];

export const JobDiscoverView: React.FC<JobDiscoverViewProps> = ({
  discoverQuery,
  onDiscoverQueryChange,
  onSearchLiveJobs,
  isSearchingJobs,
  discoveredJobs,
  hasSearched,
  onTrackDiscoveredJob,
  onPitchDiscoveredJob,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              Live Job Search & Discovery
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Queries real-time tech job feeds (Remotive & Arbeitnow APIs). Track directly or send a tailored cold pitch in 1 click.
            </p>
          </div>

          {/* Quick Query Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onDiscoverQueryChange(tag);
                  onSearchLiveJobs(tag);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchLiveJobs();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={discoverQuery}
              onChange={(e) => onDiscoverQueryChange(e.target.value)}
              placeholder="Search by title, technology or keyword (e.g. Java, Spring Boot, React, Full Stack)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingJobs}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 disabled:opacity-50 transition"
          >
            {isSearchingJobs ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Searching Live...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" /> Search Jobs
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Grid */}
      {discoveredJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Found <strong>{discoveredJobs.length}</strong> active openings for "{discoverQuery}"
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoveredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mb-1.5">
                        {job.source}
                      </span>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{job.company}</h3>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5 line-clamp-1">{job.role}</p>
                    </div>

                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition"
                        title="Open original job posting"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400 mb-3">
                    <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      <MapPin className="w-3 h-3 text-slate-500" /> {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-mono">
                        <DollarSign className="w-3 h-3" /> {job.salary}
                      </span>
                    )}
                  </div>

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800/80"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {job.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {job.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onTrackDiscoveredJob(job)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" /> Track Job
                  </button>
                  <button
                    onClick={() => onPitchDiscoveredJob(job)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Cold Pitch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSearchingJobs && (
        <div className="text-center py-16 text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-400" />
          <p className="text-xs">Fetching active jobs from global live API feeds...</p>
        </div>
      )}

      {!isSearchingJobs && discoveredJobs.length === 0 && hasSearched && (
        <div className="text-center py-14 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 text-slate-400">
          <p className="text-xs">
            No active jobs found matching "{discoverQuery}". Try a broader term like "Software", "React", or "Developer".
          </p>
        </div>
      )}
    </div>
  );
};
