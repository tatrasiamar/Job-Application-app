import React from "react";
import { Zap, X, RefreshCw } from "lucide-react";

interface SmartImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  importUrl: string;
  onImportUrlChange: (val: string) => void;
  importText: string;
  onImportTextChange: (val: string) => void;
  parseError: string | null;
  isParsing: boolean;
  onParseJob: (e: React.FormEvent) => Promise<void>;
}

export const SmartImportModal: React.FC<SmartImportModalProps> = ({
  isOpen,
  onClose,
  importUrl,
  onImportUrlChange,
  importText,
  onImportTextChange,
  parseError,
  isParsing,
  onParseJob,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Smart Job Import</h3>
              <p className="text-[11px] text-slate-400">Paste any job URL or Job Description text</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {parseError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {parseError}
          </div>
        )}

        <form onSubmit={onParseJob} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Job Posting URL (LinkedIn, Indeed, Careers)
            </label>
            <input
              type="url"
              value={importUrl}
              onChange={(e) => onImportUrlChange(e.target.value)}
              placeholder="https://company.com/careers/job-123"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Or Paste Job Description Text
            </label>
            <textarea
              rows={5}
              value={importText}
              onChange={(e) => onImportTextChange(e.target.value)}
              placeholder="Paste job posting requirements, hiring manager contact, location, salary here..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-sans leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isParsing || (!importText && !importUrl)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 disabled:opacity-50 transition"
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Extracting Details...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300" /> Extract & Add Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
