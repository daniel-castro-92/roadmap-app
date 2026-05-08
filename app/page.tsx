"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchRoadmap, saveRoadmap } from "@/lib/roadmap";
import { RoadmapData, Milestone, Task, Status } from "@/lib/types";
import { MilestoneCard } from "@/components/MilestoneCard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { AddMilestoneModal } from "@/components/AddMilestoneModal";
import { Header } from "@/components/Header";

const EMPTY_ROADMAP: RoadmapData = { milestones: [] };

export default function Home() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [defaultMilestoneId, setDefaultMilestoneId] = useState<string | undefined>();

  useEffect(() => {
    fetchRoadmap()
      .then((d) => setData(d ?? EMPTY_ROADMAP))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback(async (next: RoadmapData) => {
    setSaving(true);
    try {
      await saveRoadmap(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, []);

  const updateData = useCallback(
    (next: RoadmapData) => {
      setData(next);
      persist(next);
    },
    [persist]
  );

  const handleAddMilestone = (title: string, description: string) => {
    if (!data) return;
    const milestone: Milestone = {
      id: crypto.randomUUID(),
      title,
      description,
      order: data.milestones.length,
      tasks: [],
    };
    updateData({ milestones: [...data.milestones, milestone] });
    setShowAddMilestone(false);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    if (!data) return;
    updateData({
      milestones: data.milestones.filter((m) => m.id !== milestoneId),
    });
  };

  const handleAddTask = (milestoneId: string, title: string, notes: string, link: string, deadline: string) => {
    if (!data) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      status: "todo",
      notes,
      link: link || undefined,
      deadline: deadline || undefined,
      order:
        data.milestones.find((m) => m.id === milestoneId)?.tasks.length ?? 0,
    };
    updateData({
      milestones: data.milestones.map((m) =>
        m.id === milestoneId ? { ...m, tasks: [...m.tasks, task] } : m
      ),
    });
    setShowAddTask(false);
    setDefaultMilestoneId(undefined);
  };

  const handleUpdateTask = (
    milestoneId: string,
    taskId: string,
    updates: Partial<Task>
  ) => {
    if (!data) return;
    updateData({
      milestones: data.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: m.tasks.map((t) =>
                t.id === taskId ? { ...t, ...updates } : t
              ),
            }
          : m
      ),
    });
  };

  const handleDeleteTask = (milestoneId: string, taskId: string) => {
    if (!data) return;
    updateData({
      milestones: data.milestones.map((m) =>
        m.id === milestoneId
          ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) }
          : m
      ),
    });
  };

  const handleCycleStatus = (
    milestoneId: string,
    taskId: string,
    current: Status
  ) => {
    const next: Record<Status, Status> = {
      todo: "wip",
      wip: "done",
      done: "todo",
    };
    handleUpdateTask(milestoneId, taskId, { status: next[current] });
  };

  const openAddTask = (milestoneId?: string) => {
    setDefaultMilestoneId(milestoneId);
    setShowAddTask(true);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F4F5F6" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full animate-spin"
            style={{
              border: "3px solid #F05A1A",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-sm" style={{ color: "#4A5568" }}>
            Loading roadmap…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F5F6" }}>
      <Header
        saving={saving}
        onAddTask={() => openAddTask()}
        onAddMilestone={() => setShowAddMilestone(true)}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 pb-16">
        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm text-white flex items-center justify-between"
            style={{ backgroundColor: "#F05A1A" }}
          >
            <span>{error}</span>
            <button
              className="ml-2 underline opacity-80 hover:opacity-100"
              onClick={() => setError(null)}
            >
              dismiss
            </button>
          </div>
        )}

        {data && data.milestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#0F2240" }}
            >
              <svg
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold" style={{ color: "#0F2240" }}>
              No milestones yet
            </h2>
            <p className="text-sm" style={{ color: "#4A5568" }}>
              Add your first milestone to get started.
            </p>
            <button
              onClick={() => setShowAddMilestone(true)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#F05A1A" }}
            >
              Add Milestone
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {data?.milestones
              .sort((a, b) => a.order - b.order)
              .map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onAddTask={() => openAddTask(milestone.id)}
                  onDeleteMilestone={handleDeleteMilestone}
                  onCycleStatus={handleCycleStatus}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
          </div>
        )}
      </main>

      {showAddTask && data && (
        <AddTaskModal
          milestones={data.milestones}
          defaultMilestoneId={defaultMilestoneId}
          onAdd={handleAddTask}
          onClose={() => {
            setShowAddTask(false);
            setDefaultMilestoneId(undefined);
          }}
        />
      )}

      {showAddMilestone && (
        <AddMilestoneModal
          onAdd={handleAddMilestone}
          onClose={() => setShowAddMilestone(false)}
        />
      )}
    </div>
  );
}
