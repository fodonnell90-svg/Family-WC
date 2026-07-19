// Single place that assembles the live payload (standings + matches) so the
// page and the API route can never drift apart.
import { loadDraw, loadMatches, loadTeams } from "./data";
import { matchKickoff } from "./format";
import { fetchLiveResults, type LiveResult } from "./live";
import { computeStandings } from "./scoring";
import type { Match, Standings } from "./types";

const MAX_LIVE_MS_GROUP = 2.5 * 60 * 60 * 1000;
const MAX_LIVE_MS_KNOCKOUT = 3.5 * 60 * 60 * 1000;

function finishStaleLive(matches: Match[], now: Date): Match[] {
  return matches.map((m) => {
    if (m.status !== "LIVE") return m;
    const kickoff = matchKickoff(m.date, m.time);
    const maxLive = m.round === "group" ? MAX_LIVE_MS_GROUP : MAX_LIVE_MS_KNOCKOUT;
    if (!kickoff || now.getTime() - kickoff.getTime() < maxLive) return m;
    return { ...m, status: "FT" as const };
  });
}

export interface LivePayload {
  standings: Standings;
  matches: Match[];
}

// Teams in the third place playoff — no points awarded for this match.
const THIRD_PLACE_TEAMS = new Set(["France", "England"]);

function isThirdPlaceMatch(r: LiveResult): boolean {
  // The third place match is the only knockout match where both teams
  // are known third-place finalists. We identify it by stage name or
  // by checking if both teams are the known third-place finalists.
  if (r.stage === "third-place" || r.stage === "third_place" || r.stage === "3rd-place") return true;
  if (r.round === "knockout" && r.home && r.away) {
    if (THIRD_PLACE_TEAMS.has(r.home) && THIRD_PLACE_TEAMS.has(r.away)) return true;
  }
  return false;
}

export function mergeLive(base: Match[], live: LiveResult[]): Match[] {
  const byId = new Map(base.map((m) => [m.id, { ...m }]));
  for (const r of live) {
    // Skip the third place playoff — no points awarded for this match.
    if (isThirdPlaceMatch(r)) continue;

    const ex = byId.get(r.id);
    const feedHasData = r.status !== "NS" || r.homeScore !== null || r.awayScore !== null;
    if (ex) {
      if (!feedHasData) continue;
      if (ex.status === "FT" && r.status !== "FT") continue;
      byId.set(r.id, {
        ...ex,
        homeScore: r.homeScore ?? ex.homeScore,
        awayScore: r.awayScore ?? ex.awayScore,
        homePens: r.homePens ?? ex.homePens,
        awayPens: r.awayPens ?? ex.awayPens,
        status: r.status,
        stage: r.stage ?? ex.stage,
      });
    } else if (r.home && r.away && r.stage) {
      byId.set(r.id, {
        id: r.id,
        date: r.date ?? "",
        time: null,
        timestamp: null,
        group: null,
        round: r.round ?? "knockout",
        stage: r.stage,
        home: r.home,
        away: r.away,
        homeBadge: r.homeBadge ?? null,
        awayBadge: r.awayBadge ?? null,
        venue: null,
        city: null,
        homeScore: r.homeScore ?? null,
        awayScore: r.awayScore ?? null,
        homePens: r.homePens ?? null,
        awayPens: r.awayPens ?? null,
        status: r.status,
      });
    }
  }
  return Array.from(byId.values()).sort((a, b) =>
    (a.timestamp ?? a.date ?? "").localeCompare(b.timestamp ?? b.date ?? ""),
  );
}

export async function getLivePayload(withLive = true, fresh = false): Promise<LivePayload> {
  let matches = loadMatches();
  if (withLive) {
    try {
      matches = mergeLive(matches, await fetchLiveResults(fresh));
    } catch {
      // Feed unreachable — fall back to committed + manual data silently.
    }
  }
  matches = finishStaleLive(matches, new Date());
  return {
    standings: computeStandings(loadDraw(), loadTeams(), matches),
    matches,
  };
}
