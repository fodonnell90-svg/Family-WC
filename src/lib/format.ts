import type { Progression } from "./types";

export const STAGE_LABEL: Record<string, string> = {
  "group-1": "Groups · MD 1",
  "group-2": "Groups · MD 2",
  "group-3": "Groups · MD 3",
  "round-32": "Round of 32",
  "round-16": "Round of 16",
  quarter: "Quarter-final",
  semi: "Semi-final",
  final: "Final",
};

export const PROGRESSION_LABEL: Record<Progression, string> = {
  none: "",
  group: "R32",
  "round-16": "R16",
  quarter: "QF",
  semi: "SF",
  winner: "Champions",
};

// Times are shown in UK/Irish time. Pinning the zone (rather than using the device's) also keeps server and
// client renders identical, so there's no hydration drift.
const TZ = "Europe/London";

// The instant a match kicks off (stored UTC), or null if no date.
export function matchKickoff(date: string, time: string | null): Date | null {
  if (!date) return null;
  return new Date(`${date}T${time ?? "12:00:00"}Z`);
}

// Calendar day (YYYY-MM-DD) in the pinned UK zone, for "is this today?" checks.
export function londonDayKey(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

export function formatMatchDate(date: string, time: string | null): string {
  if (!date) return "TBD";
  // Stored times come from TheSportsDB in UTC.
  const d = new Date(`${date}T${time ?? "12:00:00"}Z`);
  const day = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: TZ,
  });
  if (!time) return day;
  const hm = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  });
  return `${day} · ${hm}`;
}
