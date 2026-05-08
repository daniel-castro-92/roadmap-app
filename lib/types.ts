export type Status = "todo" | "wip" | "done";

export interface Task {
  id: string;
  title: string;
  status: Status;
  notes: string;
  link?: string;
  deadline?: string; // YYYY-MM-DD
  order: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
  tasks: Task[];
}

export interface RoadmapData {
  milestones: Milestone[];
}

export interface RoadmapRow {
  id: string;
  data: RoadmapData;
  updated_at: string;
}
