"use client";

import { useState } from "react";
import { Milestone, Task, Status } from "@/lib/types";
import { TaskRow } from "./TaskRow";

interface MilestoneCardProps {
  milestone: Milestone;
  onAddTask: () => void;
  onDeleteMilestone: (id: string) => void;
  onCycleStatus: (milestoneId: string, taskId: string, current: Status) => void;
  onUpdateTask: (
    milestoneId: string,
    taskId: string,
    updates: Partial<Task>
  ) => void;
  onDeleteTask: (milestoneId: string, taskId: string) => void;
}

const statusOrder: Record<Status, number> = { todo: 0, wip: 1, done: 2 };

function progress(tasks: Task[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100);
}

export function MilestoneCard({
  milestone,
  onAddTask,
  onDeleteMilestone,
  onCycleStatus,
  onUpdateTask,
  onDeleteTask,
}: MilestoneCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pct = progress(milestone.tasks);
  const sorted = [...milestone.tasks].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status] || a.order - b.order
  );

  return (
    <div
      className="rounded-xl shadow-sm overflow-hidden"
      style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
    >
      {/* Milestone header */}
      <div style={{ backgroundColor: "#0F2240" }} className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCollapsed((v) => !v)}
                className="text-white opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className={`transition-transform ${collapsed ? "-rotate-90" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <h2 className="text-white font-bold text-base truncate">
                {milestone.title}
              </h2>
            </div>
            {milestone.description && (
              <p className="text-sm mt-0.5 ml-6 opacity-70" style={{ color: "#F4F5F6" }}>
                {milestone.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold text-white opacity-70">
              {milestone.tasks.filter((t) => t.status === "done").length}/
              {milestone.tasks.length}
            </span>
            <button
              onClick={onAddTask}
              title="Add task to this milestone"
              className="px-2.5 py-1 rounded text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#F05A1A" }}
            >
              + Task
            </button>
            <button
              onClick={() => onDeleteMilestone(milestone.id)}
              title="Delete milestone"
              className="p-1 rounded text-white opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {milestone.tasks.length > 0 && (
          <div className="mt-2 ml-6">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: "#F05A1A" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tasks */}
      {!collapsed && (
        <div className="p-3 space-y-2">
          {sorted.length === 0 ? (
            <button
              onClick={onAddTask}
              className="w-full py-4 text-sm rounded-lg border-2 border-dashed transition-colors hover:opacity-80"
              style={{ borderColor: "#CBD5E0", color: "#4A5568" }}
            >
              No tasks yet — click to add one
            </button>
          ) : (
            sorted.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                milestoneId={milestone.id}
                onCycleStatus={onCycleStatus}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
