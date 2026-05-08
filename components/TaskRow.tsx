"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Task, Status } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface TaskRowProps {
  task: Task;
  milestoneId: string;
  onCycleStatus: (milestoneId: string, taskId: string, current: Status) => void;
  onUpdateTask: (milestoneId: string, taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (milestoneId: string, taskId: string) => void;
}

// ── date helpers ────────────────────────────────────────────────────────────

function parseLocal(str: string) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDeadline(dateStr: string): string {
  const date = parseLocal(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const label = date.toLocaleDateString("en-US", opts);
  const yearSuffix = date.getFullYear() !== today.getFullYear() ? ` '${String(date.getFullYear()).slice(-2)}` : "";
  return label + yearSuffix;
}

function deadlineColor(dateStr: string): string {
  const date = parseLocal(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return "#E53E3E";   // red — overdue
  if (diff <= 7) return "#D97706";  // amber — within 7 days
  return "#9CA3AF";                 // grey — future
}

// ── inline calendar popover ─────────────────────────────────────────────────

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarPopover({
  value,
  onChange,
  onClose,
}: {
  value?: string;
  onChange: (iso: string | undefined) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const seed = value ? parseLocal(value) : today;
  const [viewYear, setViewYear] = useState(seed.getFullYear());
  const [viewMonth, setViewMonth] = useState(seed.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(onClose, [onClose]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selected = value ? parseLocal(value) : null;
  const isSel = (d: number) =>
    !!selected &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === d;
  const isToday = (d: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === d;

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      ref={ref}
      className="absolute z-50 bg-white rounded-xl shadow-2xl border p-3 select-none"
      style={{
        bottom: "calc(100% + 8px)",
        right: 0,
        width: 252,
        borderColor: "#E2E8F0",
      }}
    >
      {/* month nav */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-base leading-none"
          style={{ color: "#4A5568" }}
        >
          ‹
        </button>
        <span className="text-xs font-semibold" style={{ color: "#0F2240" }}>
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-base leading-none"
          style={{ color: "#4A5568" }}
        >
          ›
        </button>
      </div>

      {/* day-of-week labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center" style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>
            {d}
          </div>
        ))}
      </div>

      {/* day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <button
            key={i}
            disabled={!day}
            onClick={() => {
              if (day) {
                onChange(toISO(new Date(viewYear, viewMonth, day)));
                onClose();
              }
            }}
            className="h-7 w-full flex items-center justify-center rounded-full text-xs transition-colors"
            style={{
              backgroundColor: day && isSel(day) ? "#F05A1A" : "transparent",
              color: !day
                ? "transparent"
                : isSel(day)
                ? "#fff"
                : isToday(day)
                ? "#F05A1A"
                : "#0F2240",
              fontWeight: (day && isSel(day)) || (day && isToday(day)) ? 700 : 400,
              cursor: day ? "pointer" : "default",
            }}
          >
            {day ?? ""}
          </button>
        ))}
      </div>

      {/* clear */}
      {value && (
        <button
          onClick={() => { onChange(undefined); onClose(); }}
          className="mt-2 w-full text-xs py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ color: "#9CA3AF", borderTop: "1px solid #F4F5F6", marginTop: 8, paddingTop: 8 }}
        >
          Clear deadline
        </button>
      )}
    </div>
  );
}

// ── TaskRow ─────────────────────────────────────────────────────────────────

export function TaskRow({ task, milestoneId, onCycleStatus, onUpdateTask, onDeleteTask }: TaskRowProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes);
  const isDone = task.status === "done";

  const saveTitle = () => {
    const trimmed = title.trim();
    if (trimmed) onUpdateTask(milestoneId, task.id, { title: trimmed });
    else setTitle(task.title);
    setEditingTitle(false);
  };

  const saveNotes = () => {
    onUpdateTask(milestoneId, task.id, { notes: notes.trim() });
    setEditingNotes(false);
  };

  const setDeadline = (iso: string | undefined) => {
    onUpdateTask(milestoneId, task.id, { deadline: iso });
  };

  return (
    <div className="rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "#E2E8F0" }}>
      <div className="flex items-start gap-2.5">

        {/* status pill */}
        <div className="flex-shrink-0 pt-0.5">
          <StatusBadge
            status={task.status}
            onClick={() => onCycleStatus(milestoneId, task.id, task.status)}
          />
        </div>

        {/* main content */}
        <div className="flex-1 min-w-0">

          {/* title row */}
          {editingTitle ? (
            <input
              autoFocus
              className="w-full text-sm font-medium outline-none border-b pb-0.5"
              style={{ color: "#0F2240", borderColor: "#F05A1A" }}
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={e => {
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

          {/* notes */}
          {editingNotes ? (
            <textarea
              autoFocus
              rows={2}
              className="w-full mt-0.5 outline-none resize-none border-b bg-transparent leading-snug"
              style={{ fontSize: 12, color: "#4A5568", borderColor: "#F05A1A" }}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={saveNotes}
              onKeyDown={e => {
                if (e.key === "Escape") { setNotes(task.notes); setEditingNotes(false); }
              }}
            />
          ) : (
            <p
              className="mt-0.5 leading-snug truncate cursor-text"
              style={{ fontSize: 12, color: notes ? "#4A5568" : "#CBD5E0" }}
              onClick={() => setEditingNotes(true)}
            >
              {notes || "type notes…"}
            </p>
          )}

          {/* deadline chip — click to open picker */}
          {task.deadline && (
            <button
              onClick={() => setShowDatePicker(p => !p)}
              className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 hover:opacity-80 transition-opacity"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: deadlineColor(task.deadline),
                backgroundColor: deadlineColor(task.deadline) + "18",
                border: `1px solid ${deadlineColor(task.deadline)}33`,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDeadline(task.deadline)}
            </button>
          )}
        </div>

        {/* right-side actions */}
        <div className="flex-shrink-0 flex items-center gap-1 pt-0.5">

          {/* calendar icon — opens picker */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(p => !p)}
              title="Set deadline"
              className="p-1 rounded hover:opacity-60 transition-opacity"
              style={{ color: task.deadline ? deadlineColor(task.deadline) : "#CBD5E0" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>

            {showDatePicker && (
              <CalendarPopover
                value={task.deadline}
                onChange={setDeadline}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </div>

          {/* trash */}
          <button
            onClick={() => onDeleteTask(milestoneId, task.id)}
            title="Delete task"
            className="p-1 rounded hover:opacity-60 transition-opacity"
            style={{ color: "#CBD5E0" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
