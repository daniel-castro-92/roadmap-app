import { supabase } from "./supabase";
import { RoadmapData, RoadmapRow } from "./types";

const ROADMAP_ID = process.env.NEXT_PUBLIC_ROADMAP_ID ?? "main";

export async function fetchRoadmap(): Promise<RoadmapData | null> {
  const { data, error } = await supabase
    .from("roadmap")
    .select("*")
    .eq("id", ROADMAP_ID)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // no rows
    throw error;
  }

  return (data as RoadmapRow).data;
}

export async function saveRoadmap(roadmapData: RoadmapData): Promise<void> {
  const { error } = await supabase.from("roadmap").upsert(
    { id: ROADMAP_ID, data: roadmapData, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) throw error;
}
