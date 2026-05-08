"use client";

import { useState, useEffect, useRef } from "react";
import { Milestone } from "@/lib/types";

interface AddTaskModalProps {
  milestones: Milestone[];
  defaultMilestoneId?: string;
  onAdd: (milestoneId: string, title: string, notes: string) => void;
  onClose: () => void;
}

export function AddTaskModal({
  milestones,
  defaultMilestoneId,
  onAdd,
  onClose,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [milestoneId, setMilestoneId] = useState(
    defaultMilestoneId ?? milestones[0]?.id ?? ""
  );
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !milestoneId) return;
    onAdd(milestoneId, title.trim(), notes.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,34,64,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: "white" }}>
        <div className="px-5 py-4" style={{ backgroundColor: "#0F2240" }}>
          <h2 className="text-white font-bold text-base">Add Task</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#4A5568" }}>
              MILESTONE
            </label>
            <select
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{
                borderColor: "#CBD5E0",
                color: "#0F2240",
              }}
            >
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#4A5568" }}>
              TASK TITLE
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ borderColor: "#CBD5E0", color: "#0F2240" }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#4A5568" }}>
              NOTES (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context…"
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
              style={{ borderColor: "#CBD5E0", color: "#0F2240" }}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: "#CBD5E0", color: "#4A5568" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#F05A1A" }}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
