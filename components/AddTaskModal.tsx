"use client";

import { useState, useEffect, useRef } from "react";
import { Milestone } from "@/lib/types";

interface AddTaskModalProps {
  milestones: Milestone[];
  defaultMilestoneId?: string;
  onAdd: (milestoneId: string, title: string, notes: string, link: string, deadline: string) => void;
  onClose: () => void;
}

export function AddTaskModal({ milestones, defaultMilestoneId, onAdd, onClose }: AddTaskModalProps) {
  const [milestoneId, setMilestoneId] = useState(defaultMilestoneId ?? milestones[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [deadline, setDeadline] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !milestoneId) return;
    onAdd(milestoneId, title.trim(), notes.trim(), link.trim(), deadline);
  };

  const inputStyle = { borderColor: "#CBD5E0", color: "#00695C" };
  const labelStyle = { color: "#4A5568" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,105,92,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-xl shadow-xl overflow-hidden bg-white">
        <div className="px-5 py-4" style={{ backgroundColor: "#00695C" }}>
          <h2 className="text-white font-bold text-base">Add Task</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Milestone */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={labelStyle}>MILESTONE</label>
            <select
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={inputStyle}
            >
              {milestones.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={labelStyle}>TASK TITLE</label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={labelStyle}>
              NOTES <span className="font-normal opacity-50">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context…"
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
              style={inputStyle}
            />
          </div>

          {/* Link + Deadline side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={labelStyle}>
                LINK <span className="font-normal opacity-50">(optional)</span>
              </label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://…"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={labelStyle}>
                DEADLINE <span className="font-normal opacity-50">(optional)</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border hover:opacity-80 transition-opacity"
              style={{ borderColor: "#CBD5E0", color: "#4A5568" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#80CBC4" }}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
