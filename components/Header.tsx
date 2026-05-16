"use client";

interface HeaderProps {
  saving: boolean;
  onAddTask: () => void;
  onAddMilestone: () => void;
}

export function Header({ saving, onAddTask, onAddMilestone }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-20 shadow-sm"
      style={{ backgroundColor: "#00695C" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#00897B" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h1 className="text-white font-bold text-lg tracking-tight">
            Roadmap
          </h1>
          {saving && (
            <span className="text-xs opacity-60 text-white hidden sm:inline">
              saving…
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddMilestone}
            className="px-3 py-1.5 rounded-md text-sm font-medium border transition-all hover:opacity-80"
            style={{ borderColor: "rgba(255,255,255,0.5)", color: "white" }}
          >
            + Milestone
          </button>
          <button
            onClick={onAddTask}
            className="px-3 py-1.5 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#80CBC4" }}
          >
            + Task
          </button>
        </div>
      </div>
    </header>
  );
}
