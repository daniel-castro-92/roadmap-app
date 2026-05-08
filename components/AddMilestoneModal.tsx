"use client";

import { useState, useEffect, useRef } from "react";

interface AddMilestoneModalProps {
  onAdd: (title: string, description: string) => void;
  onClose: () => void;
}

export function AddMilestoneModal({ onAdd, onClose }: AddMilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,34,64,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        style={{ backgroundColor: "white" }}
      >
        <div className="px-5 py-4" style={{ backgroundColor: "#0F2240" }}>
          <h2 className="text-white font-bold text-base">Add Milestone</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: "#4A5568" }}
            >
              MILESTONE TITLE
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Phase 1 – Discovery"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#CBD5E0", color: "#0F2240" }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: "#4A5568" }}
            >
              DESCRIPTION (optional)
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this milestone"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
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
              Add Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
