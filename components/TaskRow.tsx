"use client";

import { useState } from "react";
import { Task, Status } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface TaskRowProps {
  task: Task;
  milestoneId: string;
  onCycleStatus: (milestoneId: string, taskId: string, current: Status) => void;
  onUpdateTask: (milestoneId: string, taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (milestoneId: string, taskId: string) => void;
}

function formatDeadline(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (diff < 0) return `${label} · overdue`;
  if (diff === 0) return `${label} · today`;
  if (diff === 1) return `${label} · tomorrow`;
  return `${label} · ${diff}d`;
}

export function TaskRow({ task, milestoneId, onCycleStatus, onUpdateTask, onDeleteTask }: TaskRowProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);
  const isDone = task.status === "done";

  const saveTitle = () => {
    const trimmed = title.trim();
    if (trimmed) onUpdateTask(milestoneId, task.id, { title: trimmed });
    else setTitle(task.title);
    setEditingTitle(false);
  };

  const isOverdue = task.deadline
    ? (() => {
        const [y, m, d] = task.deadline.split("-").map(Number);
        const due = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
      })()
    : false;

  return (
    <div className="rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "#E2E8F0" }}>
      <div className="flex items-start gap-2.5">

        {/* 1. Status pill */}
        <div className="flex-shrink-0 pt-0.5">
          <StatusBadge
            status={task.status}
            onClick={() => onCycleStatus(milestoneId, task.id, task.status)}
          />
        </div>

        {/* 2. Title + link + notes + deadline */}
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input
              autoFocus
              className="w-full text-sm font-medium outline-none border-b pb-0.5"
              style={{ color: "#0F2240", borderColor: "#F05A1A" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") { setTitle(task.title); setEditingTitle(false); }
              }}
            />
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="text-sm font-medium truncate"
                style={{
                  color: "#0F2240",
                  textDecoration: isDone ? "line-through" : "none",
                  opacity: isDone ? 0.45 : 1,
                  cursor: "default",
                }}
                onDoubleClick={() => setEditingTitle(true)}
              >
                {task.title}
              </span>
              {/* 4. Link arrow — only if link exists */}
              {task.link && (
                <a
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs font-bold hover:opacity-60 transition-opacity"
                  style={{ color: "#F05A1A" }}
                >
                  ↗
                </a>
              )}
            </div>
          )}

          {/* 3. Notes — always shown if exists, never hidden */}
          {task.notes && (
            <p className="mt-0.5 leading-snug truncate" style={{ fontSize: "12px", color: "#4A5568" }}>
              {task.notes}
            </p>
          )}

          {/* Deadline */}
          {task.deadline && (
            <p
              className="mt-0.5 leading-snug"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: isOverdue ? "#E53E3E" : "#4A5568",
              }}
            >
              📅 {formatDeadline(task.deadline)}
            </p>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => onDeleteTask(milestoneId, task.id)}
          title="Delete task"
          className="flex-shrink-0 p-1 rounded hover:opacity-60 transition-opacity"
          style={{ color: "#CBD5E0" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

      </div>
    </div>
  );
}
