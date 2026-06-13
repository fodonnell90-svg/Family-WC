// Live fetch helper for TheSportsDB. Used by the optional /api/refresh route and
// can be called from the standings route for on-the-fly live merge. Designed to
// degrade gracefully: if the feed is unreachable, callers fall back to committed
// fixtures + data/results.json so the app NEVER hard-depends on a third party.

import type { Match } from "./types";

const LEAGUE = "4429";
const SEASON = "2026";
const API = "https://www.thesportsdb.com/api/v1/json/123";

const STAGE_BY_ROUND: Record<string, string> = {
  "1": "group-1",
  "2": "group-2",
  "3": "group-3",
  "125": "round-32",
  "150": "round-16",
  "160": "semi",
  "170": "final",
  "200": "quarter",
  "201": "semi",
};

function normaliseStatus(s: string | null | undefined): Match["status"] {
  if (!s) return "NS";
  const v = s.toUpperCase();
  if (["FT", "AET", "PEN", "MATCH FINISHED"].includes(v)) return "FT";
  if (["1H", "2H", "HT", "ET", "LIVE", "IN PLAY"].includes(v)) return "LIVE";
  return "NS";
}

export interface LiveResult {
  id: string;
  homeScore: number | null;
  awayScore: number | null;
  status: Match["status"];
  stage?: string;
  home?: string;
  away?: string;
  homeBadge?: string | null;
  awayBadge?: string | null;
  round?: "group" | "knockout";
  date?: string;
}

// Last successful payload per round, kept in module memory. If the feed
// rate-limits (429) or errors, we serve this instead of "no data" so live
// scores don't vanish mid-match. Per-instance only — resets on cold start,
// after which the Next data cache / committed data cover the gap.
const lastGood = new Map<string, LiveResult[]>();

async function fetchRound(r: string, fresh = false): Promise<LiveResult[]> {
  const res = await fetch(
    `${API}/eventsround.php?id=${LEAGUE}&r=${r}&s=${SEASON}`,
    fresh ? { cache: "no-store" } : { next: { revalidate: 30 } },
  );
  if (!res.ok) return lastGood.get(r) ?? [];
  const json = (await res.json()) as { events?: Array<Record<string, string | null>> };
  const events = json.events ?? [];
  const results = events.map((e) => {
    const round = String(e.intRound ?? "");
    const isKo = Number(round) >= 100;
    return {
      id: String(e.idEvent),
      homeScore: e.intHomeScore === null ? null : Number(e.intHomeScore),
      awayScore: e.intAwayScore === null ? null : Number(e.intAwayScore),
      status: normaliseStatus(e.strStatus),
      stage: STAGE_BY_ROUND[round],
      ...(isKo
        ? {
            home: e.strHomeTeam ?? undefined,
            away: e.strAwayTeam ?? undefined,
            homeBadge: e.strHomeTeamBadge ?? null,
            awayBadge: e.strAwayTeamBadge ?? null,
            round: "knockout" as const,
            date: e.dateEvent ?? undefined,
          }
        : {}),
    };
  });
  lastGood.set(r, results);
  return results;
}

// `fresh` skips the data cache and hits the feed directly (manual refresh).
export async function fetchLiveResults(fresh = false): Promise<LiveResult[]> {
  const rounds = ["1", "2", "3", "125", "150", "160", "170", "200", "201"];
  const all: LiveResult[] = [];
  const settled = await Promise.allSettled(rounds.map((r) => fetchRound(r, fresh)));
  settled.forEach((s, i) => {
    if (s.status === "fulfilled") all.push(...s.value);
    else all.push(...(lastGood.get(rounds[i]) ?? []));
  });
  return all;
}
