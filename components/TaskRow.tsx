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

export function TaskRow({
  task,
  milestoneId,
  onCycleStatus,
  onUpdateTask,
  onDeleteTask,
}: TaskRowProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);

  const saveTitle = () => {
    if (title.trim()) onUpdateTask(milestoneId, task.id, { title: title.trim() });
    else setTitle(task.title);
    setEditingTitle(false);
  };

  const isDone = task.status === "done";

  return (
    <div
      className="rounded-lg border px-3 py-2.5"
      style={{ backgroundColor: "white", borderColor: "#E2E8F0" }}
    >
      {/* Main row: status | title + link | delete */}
      <div className="flex items-start gap-2.5">
        {/* Status pill — flex-shrink so it never wraps */}
        <div className="flex-shrink-0 pt-0.5">
          <StatusBadge
            status={task.status}
            onClick={() => onCycleStatus(milestoneId, task.id, task.status)}
          />
        </div>

        {/* Title + link */}
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input
              autoFocus
              className="w-full text-sm font-medium outline-none border-b"
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
              <p
                className="text-sm font-medium truncate cursor-default select-none"
                style={{
                  color: "#0F2240",
                  textDecoration: isDone ? "line-through" : "none",
                  opacity: isDone ? 0.5 : 1,
                }}
                onDoubleClick={() => setEditingTitle(true)}
              >
                {task.title}
              </p>
              {task.link && (
                <a
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "#F05A1A" }}
                  title={task.link}
                >
                  ↗
                </a>
              )}
            </div>
          )}

          {/* Notes subtitle — always visible when note exists */}
          {task.notes && !editingTitle && (
            <p
              className="mt-0.5 leading-snug"
              style={{ fontSize: "12px", color: "#4A5568" }}
            >
              {task.notes}
            </p>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => onDeleteTask(milestoneId, task.id)}
          title="Delete task"
          className="flex-shrink-0 p-1 rounded transition-opacity hover:opacity-70"
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
