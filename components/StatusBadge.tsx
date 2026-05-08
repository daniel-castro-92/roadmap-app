"use client";

import { Status } from "@/lib/types";

const CONFIG: Record<
  Status,
  { label: string; bg: string; text: string; dot: string }
> = {
  todo: {
    label: "To Do",
    bg: "#E8EBF0",
    text: "#4A5568",
    dot: "#4A5568",
  },
  wip: {
    label: "WIP",
    bg: "#FFF3EC",
    text: "#F05A1A",
    dot: "#F05A1A",
  },
  done: {
    label: "Done",
    bg: "#E6F4EA",
    text: "#1E7E34",
    dot: "#1E7E34",
  },
};

interface StatusBadgeProps {
  status: Status;
  onClick?: () => void;
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const cfg = CONFIG[status];
  return (
    <button
      onClick={onClick}
      title="Click to cycle status"
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 cursor-pointer select-none"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: cfg.dot }}
      />
      {cfg.label}
    </button>
  );
}
