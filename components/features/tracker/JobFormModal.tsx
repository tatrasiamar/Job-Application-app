import React from "react";
import { X } from "lucide-react";
import { JobApplication, JobStatus } from "@/types";

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingJob: JobApplication | null;
  jobForm: {
    company: string;
    role: string;
    contactName: string;
    contactEmail: string;
    jobUrl: string;
    location: string;
    salary: string;
    status: JobStatus;
    notes: string;
  };
  onJobFormChange: (updater: (prev: any) => any) => void;
  onSaveJob: (e: React.FormEvent) => Promise<void>;
}

export const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  editingJob,
  jobForm,
  onJobFormChange,
  onSaveJob,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 sticky top-0 bg-slate-900 z-10">
          <h3 className="text-base font-bold text-white">
            {editingJob ? "Edit Job Application" : "Add New Application"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSaveJob} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={jobForm.company}
                onChange={(e) =>
                  onJobFormChange((prev: any) => ({ ...prev, company: e.target.value }))
                }
                placeholder="e.g. Google"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Role Title *</label>
              <input
                type="text"
                required
                value={jobForm.role}
                onChange={(e) =>
                  onJobFormChange((prev: any) => ({ ...prev, role: e.target.value }))
                }
                placeholder="e.g. SDE-2"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Recruiter Name</label>
              <input
                type="text"
                value={jobForm.contactName}
                onChange={(e) =>
                  onJobFormChange((prev: any) => ({ ...prev, contactName: e.target.value }))
                }
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Recruiter Email</label>
              <input
                type="email"
                value={jobForm.contactEmail}
                onChange={(e) =>
                  onJobFormChange((prev: any) => ({ ...prev, contactEmail: e.target.value }))
                }
                placeholder="recruiter@company.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={jobForm.location}
                onChange={(e) =>
                  onJobFormChange((prev: any) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Remote / City"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Salary Range</label>
              <input
                type="text"
                value={jobForm.salary}
                onChange={(e) =>
                  onJobFormChange((prev: any) => ({ ...prev, salary: e.target.value }))
                }
                placeholder="₹25 - ₹35 LPA"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={jobForm.status}
                onChange={(e) =>
                  onJobFormChange((prev: any) => ({ ...prev, status: e.target.value as JobStatus }))
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Cold Emailed</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Job Link / Career URL</label>
            <input
              type="url"
              value={jobForm.jobUrl}
              onChange={(e) =>
                onJobFormChange((prev: any) => ({ ...prev, jobUrl: e.target.value }))
              }
              placeholder="https://company.com/careers/job-id"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Notes & Follow-up Details</label>
            <textarea
              rows={3}
              value={jobForm.notes}
              onChange={(e) =>
                onJobFormChange((prev: any) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Referral notes, tech stack requirements, interview tips..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
            >
              {editingJob ? "Save Changes" : "Create Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
