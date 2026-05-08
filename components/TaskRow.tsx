"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Task, Status } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface TaskRowProps {
  task: Task;
  milestoneId: string;
  onCycleStatus: (milestoneId: string, taskId: string, current: Status) => void;
  onUpdateTask: (milestoneId: string, taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (milestoneId: string, taskId: string) => void;
}

// ── date helpers ─────────────────────────────────────────────────────────────

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
  const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const yearSuffix =
    date.getFullYear() !== today.getFullYear()
      ? ` '${String(date.getFullYear()).slice(-2)}`
      : "";
  return label + yearSuffix;
}

function deadlineColor(dateStr: string): string {
  const date = parseLocal(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return "#E53E3E";
  if (diff <= 7) return "#D97706";
  return "#9CA3AF";
}

// ── calendar popover (portal, fixed-positioned) ───────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPopover({
  value,
  anchorEl,
  onChange,
  onClose,
}: {
  value?: string;
  anchorEl: HTMLElement | null;
  onChange: (iso: string | undefined) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const seed = value ? parseLocal(value) : today;
  const [viewYear, setViewYear] = useState(seed.getFullYear());
  const [viewMonth, setViewMonth] = useState(seed.getMonth());
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const CAL_W = 280;
  const CAL_H = 300;

  // Position relative to the anchor button
  useEffect(() => {
    if (!anchorEl) return;
    const r = anchorEl.getBoundingClientRect();
    let top = r.top - CAL_H - 8;
    if (top < 8) top = r.bottom + 8; // flip below if not enough room above
    let left = r.right - CAL_W;
    if (left < 8) left = 8;
    if (left + CAL_W > window.innerWidth - 8) left = window.innerWidth - CAL_W - 8;
    setPos({ top, left });
  }, [anchorEl]);

  // Close on outside click
  const close = useCallback(onClose, [onClose]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close, anchorEl]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
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
  const isTod = (d: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === d;

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: CAL_W,
        zIndex: 9999,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(15,34,64,0.18)",
        border: "1px solid #E2E8F0",
        padding: 14,
        userSelect: "none",
      }}
    >
      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button
          onClick={prevMonth}
          style={{
            width: 28, height: 28, borderRadius: 6, border: "1px solid #E2E8F0",
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#4A5568", fontSize: 16, lineHeight: 1,
          }}
        >
          ‹
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0F2240" }}>{monthLabel}</span>
        <button
          onClick={nextMonth}
          style={{
            width: 28, height: 28, borderRadius: 6, border: "1px solid #E2E8F0",
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#4A5568", fontSize: 16, lineHeight: 1,
          }}
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "#9CA3AF", padding: "2px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px 0" }}>
        {cells.map((day, i) => {
          const sel = day !== null && isSel(day);
          const tod = day !== null && isTod(day);
          return (
            <button
              key={i}
              disabled={!day}
              onClick={() => {
                if (day) { onChange(toISO(new Date(viewYear, viewMonth, day))); onClose(); }
              }}
              style={{
                height: 30,
                width: "100%",
                borderRadius: "50%",
                border: "none",
                backgroundColor: sel ? "#F05A1A" : "transparent",
                color: !day ? "transparent" : sel ? "#fff" : tod ? "#F05A1A" : "#0F2240",
                fontWeight: sel || tod ? 700 : 400,
                fontSize: 13,
                cursor: day ? "pointer" : "default",
                outline: tod && !sel ? "2px solid #F05A1A" : "none",
                outlineOffset: -2,
                transition: "background-color 0.1s",
              }}
              onMouseEnter={e => {
                if (day && !sel) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F4F5F6";
              }}
              onMouseLeave={e => {
                if (day && !sel) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              {day ?? ""}
            </button>
          );
        })}
      </div>

      {/* Clear button */}
      {value && (
        <button
          onClick={() => { onChange(undefined); onClose(); }}
          style={{
            marginTop: 10,
            width: "100%",
            padding: "6px 0",
            borderRadius: 6,
            border: "1px solid #E2E8F0",
            background: "#fff",
            color: "#9CA3AF",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Clear deadline
        </button>
      )}
    </div>,
    document.body
  );
}

// ── TaskRow ───────────────────────────────────────────────────────────────────

export function TaskRow({ task, milestoneId, onCycleStatus, onUpdateTask, onDeleteTask }: TaskRowProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes);
  const calBtnRef = useRef<HTMLButtonElement>(null);
  const chipBtnRef = useRef<HTMLButtonElement>(null);
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

          {/* title */}
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

          {/* deadline chip */}
          {task.deadline && (
            <button
              ref={chipBtnRef}
              onClick={() => setShowDatePicker(p => !p)}
              className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 hover:opacity-80 transition-opacity"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: deadlineColor(task.deadline),
                backgroundColor: deadlineColor(task.deadline) + "18",
                border: `1px solid ${deadlineColor(task.deadline)}40`,
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

        {/* right icons */}
        <div className="flex-shrink-0 flex items-center gap-0.5 pt-0.5">

          {/* calendar icon */}
          <button
            ref={calBtnRef}
            onClick={() => setShowDatePicker(p => !p)}
            title="Set deadline"
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              width: 30, height: 30,
              color: task.deadline ? deadlineColor(task.deadline) : "#94A3B8",
              backgroundColor: task.deadline ? deadlineColor(task.deadline) + "15" : "transparent",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = task.deadline ? deadlineColor(task.deadline) + "25" : "#F1F5F9")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = task.deadline ? deadlineColor(task.deadline) + "15" : "transparent")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>

          {/* trash */}
          <button
            onClick={() => onDeleteTask(milestoneId, task.id)}
            title="Delete task"
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 30, height: 30, color: "#94A3B8" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

      </div>

      {/* portal calendar */}
      {showDatePicker && (
        <CalendarPopover
          value={task.deadline}
          anchorEl={calBtnRef.current}
          onChange={setDeadline}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}
