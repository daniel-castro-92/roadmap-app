"use client";

import { useState } from "react";
import { Task, Status } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface TaskRowProps {
  task: Task;
  milestoneId: string;
  onCycleStatus: (milestoneId: string, taskId: string, current: Status) => void;
  onUpdateTask: (
    milestoneId: string,
    taskId: string,
    updates: Partial<Task>
  ) => void;
  onDeleteTask: (milestoneId: string, taskId: string) => void;
}

export function TaskRow({
  task,
  milestoneId,
  onCycleStatus,
  onUpdateTask,
  onDeleteTask,
}: TaskRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);

  const saveNotes = () => {
    onUpdateTask(milestoneId, task.id, { notes });
    setEditingNotes(false);
  };

  const saveTitle = () => {
    if (title.trim()) onUpdateTask(milestoneId, task.id, { title: title.trim() });
    else setTitle(task.title);
    setEditingTitle(false);
  };

  return (
    <div
      className="rounded-lg border transition-shadow"
      style={{ backgroundColor: "white", borderColor: "#E2E8F0" }}
    >
      <div className="flex items-start gap-3 px-3 py-2.5">
        {/* Status badge */}
        <div className="flex-shrink-0 pt-0.5">
          <StatusBadge
            status={task.status}
            onClick={() => onCycleStatus(milestoneId, task.id, task.status)}
          />
        </div>

        {/* Title */}
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
                if (e.key === "Escape") {
                  setTitle(task.title);
                  setEditingTitle(false);
                }
              }}
            />
          ) : (
            <p
              className="text-sm font-medium cursor-pointer hover:opacity-70 truncate"
              style={{
                color: "#0F2240",
                textDecoration: task.status === "done" ? "line-through" : "none",
                opacity: task.status === "done" ? 0.6 : 1,
              }}
              onDoubleClick={() => setEditingTitle(true)}
            >
              {task.title}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            title="Notes"
            className="p-1 rounded hover:opacity-70 transition-opacity"
            style={{ color: "#4A5568" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {task.notes && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full -mt-2 -ml-1"
                style={{ backgroundColor: "#F05A1A" }}
              />
            )}
          </button>
          <button
            onClick={() => onDeleteTask(milestoneId, task.id)}
            title="Delete task"
            className="p-1 rounded hover:opacity-70 transition-opacity"
            style={{ color: "#4A5568" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Notes panel */}
      {expanded && (
        <div
          className="px-3 pb-3 border-t"
          style={{ borderColor: "#E2E8F0" }}
        >
          {editingNotes ? (
            <div className="mt-2">
              <textarea
                autoFocus
                className="w-full text-sm p-2 rounded border outline-none resize-none"
                style={{
                  color: "#4A5568",
                  borderColor: "#F05A1A",
                  minHeight: "80px",
                }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={saveNotes}
                placeholder="Add notes…"
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={saveNotes}
                  className="text-xs px-2 py-1 rounded text-white"
                  style={{ backgroundColor: "#F05A1A" }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNotes(task.notes);
                    setEditingNotes(false);
                  }}
                  className="text-xs px-2 py-1 rounded"
                  style={{ color: "#4A5568", backgroundColor: "#E8EBF0" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className="mt-2 text-sm cursor-pointer hover:opacity-70 min-h-[1.5rem]"
              style={{ color: "#4A5568" }}
              onClick={() => setEditingNotes(true)}
            >
              {task.notes ? (
                <p className="whitespace-pre-wrap">{task.notes}</p>
              ) : (
                <p className="italic opacity-50">Click to add notes…</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
