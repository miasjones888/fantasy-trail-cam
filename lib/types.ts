import type { TransformMode, Subject } from "./stations";

export interface Anomaly {
  id: string;
  cam: string;
  camName: string;
  subject: Subject;
  mode: TransformMode;
  ts: string;
  date: string;
  species: string | null;
  mythology: string;
  action: string | null;
  glitchLines: string[];
  delirLabels: string[];
  capture: { wing: number; double: number };
  thumbnail: string | null; // base64 data URL
  durationMs: number;
}

export interface TranscriptLine {
  ts: string;
  text: string;
  glitch: boolean;
}

export type StationMode = "mixed" | "sprout" | "double" | "delir";
export type ArchiveMode = "counter" | "strip" | "feed";
export type Frequency = "rare" | "normal" | "dense";

export interface Tweaks {
  stationMode: StationMode;
  archiveMode: ArchiveMode;
  freq: Frequency;
}
