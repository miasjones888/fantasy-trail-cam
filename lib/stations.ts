export type TransformMode = "sprout" | "double" | "delir";
export type BgHue = "forest" | "tundra" | "pasture" | "aurora";
export type Subject = "wolf" | "deer" | "bird" | "polar" | "sky";

export interface StationConfig {
  id: string;
  name: string;
  sub: string;
  youtubeId: string;
  defaultMode: TransformMode;
  bgHue: BgHue;
  subject: Subject;
  description: string;
}

export const STATIONS: StationConfig[] = [
  {
    id: "cam-01",
    name: "INTL WOLF CENTER",
    sub: "Exhibit pack · Ely MN",
    youtubeId: "CYl_uPm7yto",
    defaultMode: "double",
    bgHue: "forest",
    subject: "wolf",
    description: "Captive ambassador wolves. Human-adjacent. The original unheimlich.",
  },
  {
    id: "cam-02",
    name: "TRANSYLVANIA WILDS",
    sub: "Carpathian forest · Romania",
    youtubeId: "2BDnAMR3GLg",
    defaultMode: "sprout",
    bgHue: "forest",
    subject: "deer",
    description: "Roe deer, red deer, occasional wolf or boar. Old Europe.",
  },
  {
    id: "cam-03",
    name: "SAPSUCKER WOODS",
    sub: "Cornell FeederWatch · Ithaca NY",
    youtubeId: "x10vL6_47Dw",
    defaultMode: "delir",
    bgHue: "forest",
    subject: "bird",
    description: "Feeder station. Dozens of species, flashes of colour, classifier delirium fodder.",
  },
  {
    id: "cam-04",
    name: "WAPUSK · CAPE SOUTH",
    sub: "Hudson Bay · Churchill MB",
    youtubeId: "lyX7ZxWU64A",
    defaultMode: "sprout",
    bgHue: "tundra",
    subject: "polar",
    description: "Polar bears waiting for sea ice. Snow and absence. The slowest tension.",
  },
];

export const CAM_BY_ID = Object.fromEntries(STATIONS.map((s) => [s.id, s]));
