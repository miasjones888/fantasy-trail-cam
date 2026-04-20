import type { Subject } from "./stations";

export const AMBIENT: Record<Subject, string[][]> = {
  wolf: [["WIND"], ["DISTANT VEHICLE"], ["WIND", "PANTING"], ["[soft howl · 2s]"], ["WIND"], ["WIND", "FOOTFALLS"]],
  deer: [["WIND", "LEAF RUSTLE"], ["[hoof on soil]"], ["WIND"], ["BIRDSONG · distant"], ["[startle · brief]"], ["WIND"]],
  bird: [["[chickadee · 4 notes]"], ["WIND"], ["[wing flutter]"], ["[finch call]"], ["[feeder contact]"], ["WIND"]],
  polar: [["WIND"], ["ICE CREAK"], ["WIND · low"], ["[silence]"], ["[low exhale]"], ["WIND"]],
  sky: [["[SILENCE]"], ["DISTANT WIND"], ["[CRACKLE · ionospheric?]"], ["[SILENCE]"]],
};
