import fs from "node:fs";
import path from "node:path";
import type { Draw, Match, Team } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(file: string): T {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

export function loadTeams(): Team[] {
  return readJson<Team[]>("teams.json");
}

export function loadDraw(): Draw {
  return readJson<Draw>("draw.json");
}

export function loadFixtures(): Match[] {
  return readJson<Match[]>("fixtures.json");
}

/**
 * Score/status overrides keyed by match id. This is the manual-edit + poller
 * surface: `data/results.json` is the editable source of truth for live data,
 * so the app never depends on a third-party API being reachable at request time.
 *
 * Shape: { "<matchId>": { homeScore, awayScore, status, stage? } }
 */
export interface ResultOverride {
  homeScore?: number | null;
  awayScore?: number | null;
  homePens?: number | null;
  awayPens?: number | null;
  status?: Match["status"];
  stage?: string;
  // For knockout fixtures added after the draw resolves.
  home?: string;
  away?: string;
  group?: string | null;
  round?: Match["round"];
  date?: string;
  homeBadge?: string | null;
  awayBadge?: string | null;
}

export function loadResults(): Record<string, ResultOverride> {
  const file = path.join(DATA_DIR, "results.json");
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return {};
  }
}

/**
 * Merge committed fixtures with live/manual result overrides. Overrides can
 * also INTRODUCE knockout matches that didn't exist at draw time (keyed by a
 * new id), which is how the bracket fills in as the tournament progresses.
 */
export function loadMatches(): Match[] {
  const fixtures = loadFixtures();
  const overrides = loadResults();
  const byId = new Map<string, Match>(fixtures.map((m) => [m.id, { ...m }]));

  for (const [id, ov] of Object.entries(overrides)) {
    const existing = byId.get(id);
    if (existing) {
      byId.set(id, {
        ...existing,
        homeScore: ov.homeScore ?? existing.homeScore,
        awayScore: ov.awayScore ?? existing.awayScore,
        homePens: ov.homePens ?? existing.homePens,
        awayPens: ov.awayPens ?? existing.awayPens,
        status: ov.status ?? existing.status,
        stage: ov.stage ?? existing.stage,
      });
    } else if (ov.home && ov.away && ov.stage) {
      // New knockout fixture introduced via overrides.
      byId.set(id, {
        id,
        date: ov.date ?? "",
        time: null,
        timestamp: null,
        group: ov.group ?? null,
        round: ov.round ?? "knockout",
        stage: ov.stage,
        home: ov.home,
        away: ov.away,
        homeBadge: ov.homeBadge ?? null,
        awayBadge: ov.awayBadge ?? null,
        venue: null,
        city: null,
        homeScore: ov.homeScore ?? null,
        awayScore: ov.awayScore ?? null,
        homePens: ov.homePens ?? null,
        awayPens: ov.awayPens ?? null,
        status: ov.status ?? "NS",
      });
    }
  }

  return Array.from(byId.values()).sort((a, b) =>
    (a.timestamp ?? a.date ?? "").localeCompare(b.timestamp ?? b.date ?? ""),
  );
}
