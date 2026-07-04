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
  homePens: number | null;
  awayPens: number | null;
  status: Match["status"];
  stage?: string;
  home?: string;
  away?: string;
  homeBadge?: string | null;
  awayBadge?: string | null;
  round?: "group" | "knockout";
  date?: string;
}

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
    // homeScore/awayScore = score after 90 or 120 mins (does NOT include shootout goals).
    // homePens/awayPens = shootout score only, used to determine winner when level after ET.
    const homeScore = e.intHomeScore === null ? null : Number(e.intHomeScore);
    const awayScore = e.intAwayScore === null ? null : Number(e.intAwayScore);
    const homePens = e.intHomeScorePenalty == null ? null : Number(e.intHomeScorePenalty);
    const awayPens = e.intAwayScorePenalty == null ? null : Number(e.intAwayScorePenalty);
    return {
      id: String(e.idEvent),
      homeScore,
      awayScore,
      homePens,
      awayPens,
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
