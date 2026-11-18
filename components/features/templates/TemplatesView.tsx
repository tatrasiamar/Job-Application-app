import React, { useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { EmailTemplate } from "@/types";
import { Modal } from "@/components/ui/Modal";

interface TemplatesViewProps {
  templates: EmailTemplate[];
  onApplyTemplate: (tplId: string) => void;
  onTemplatesChange: (updater: (prev: EmailTemplate[]) => EmailTemplate[]) => void;
  onShowToast: (msg: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onApplyTemplate,
  onTemplatesChange,
  onShowToast,
}) => {
  const [isTplModalOpen, setIsTplModalOpen] = useState(false);
  const [editingTpl, setEditingTpl] = useState<EmailTemplate | null>(null);
  const [tplForm, setTplForm] = useState({
    name: "",
    category: "General",
    subject: "",
    body: "",
  });

  const handleOpenAdd = () => {
    setEditingTpl(null);
    setTplForm({ name: "", category: "General", subject: "", body: "" });
    setIsTplModalOpen(true);
  };

  const handleOpenEdit = (tpl: EmailTemplate) => {
    setEditingTpl(tpl);
    setTplForm({
      name: tpl.name,
      category: tpl.category,
      subject: tpl.subject,
      body: tpl.body,
    });
    setIsTplModalOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTpl) {
        const res = await fetch("/api/templates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingTpl.id, ...tplForm }),
        });
        const data = await res.json();
        if (data.success) {
          onTemplatesChange((prev) =>
            prev.map((t) => (t.id === editingTpl.id ? data.template : t))
          );
          onShowToast("Template updated!");
        }
      } else {
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tplForm),
        });
        const data = await res.json();
        if (data.success) {
          onTemplatesChange((prev) => [...prev, data.template]);
          onShowToast("New template created!");
        }
      }
      setIsTplModalOpen(false);
    } catch (err) {
      console.error("Template save error:", err);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      onTemplatesChange((prev) => prev.filter((t) => t.id !== id));
      onShowToast("Template deleted.");
    } catch (err) {
      console.error("Delete template error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Dynamic Cold Email Templates</h2>
          <p className="text-xs text-slate-400">
            Templates support dynamic tags like <code className="text-blue-300">{"{{company}}"}</code>,{" "}
            <code className="text-blue-300">{"{{role}}"}</code>, <code className="text-blue-300">{"{{candidate_name}}"}</code>, and{" "}
            <code className="text-blue-300">{"{{candidate_skills}}"}</code>.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> Add Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {tpl.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(tpl)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(tpl.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{tpl.name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
                {tpl.subject}
              </p>
              <p className="text-xs text-slate-300 font-sans whitespace-pre-line line-clamp-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                {tpl.body}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 mt-4 flex justify-end">
              <button
                onClick={() => onApplyTemplate(tpl.id)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
              >
                Use in Composer &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Modal */}
      <Modal
        isOpen={isTplModalOpen}
        onClose={() => setIsTplModalOpen(false)}
        title={editingTpl ? "Edit Template" : "Add New Template"}
      >
        <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Template Name *</label>
              <input
                type="text"
                required
                value={tplForm.name}
                onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })}
                placeholder="e.g. SDE-2 Pitch"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={tplForm.category}
                onChange={(e) => setTplForm({ ...tplForm, category: e.target.value })}
                placeholder="e.g. Application, Networking"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Subject Line *</label>
            <input
              type="text"
              required
              value={tplForm.subject}
              onChange={(e) => setTplForm({ ...tplForm, subject: e.target.value })}
              placeholder="e.g. Application: {{role}} - {{candidate_name}}"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-300">Message Body *</label>
              <span className="text-[10px] text-slate-500">Supports variable tags</span>
            </div>
            <textarea
              rows={8}
              required
              value={tplForm.body}
              onChange={(e) => setTplForm({ ...tplForm, body: e.target.value })}
              placeholder="Write your email template using {{candidate_name}}, {{company}}, {{role}}, {{recruiter_name}}..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-sans leading-relaxed"
            />
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400">
            <span className="font-bold text-slate-300 block mb-1">Available Dynamic Tags:</span>
            <code>{"{{company}}"}</code>, <code>{"{{role}}"}</code>, <code>{"{{recruiter_name}}"}</code>, <code>{"{{candidate_name}}"}</code>, <code>{"{{candidate_title}}"}</code>, <code>{"{{candidate_skills}}"}</code>, <code>{"{{candidate_experience}}"}</code>, <code>{"{{candidate_notice}}"}</code>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsTplModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
            >
              {editingTpl ? "Save Changes" : "Create Template"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
