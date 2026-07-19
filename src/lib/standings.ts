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

// Third place teams — skip this match entirely, no points awarded.
const THIRD_PLACE_TEAMS = new Set(["France", "England"]);

function isThirdPlaceMatch(home?: string, away?: string): boolean {
  if (!home || !away) return false;
  return THIRD_PLACE_TEAMS.has(home) && THIRD_PLACE_TEAMS.has(away);
}

export function mergeLive(base: Match[], live: LiveResult[]): Match[] {
  const byId = new Map(base.map((m) => [m.id, { ...m }]));

  // Also build a lookup by "home|away" so we can detect duplicates
  // where the API returns the same fixture under a different ID.
  const byTeamPair = new Map(
    base.map((m) => [`${m.home}|${m.away}`, m.id])
  );

  for (const r of live) {
    // Skip third place playoff entirely.
    if (isThirdPlaceMatch(r.home, r.away)) continue;

    const feedHasData = r.status !== "NS" || r.homeScore !== null || r.awayScore !== null;
    if (!feedHasData) continue;

    // Check if this match already exists under a different ID (dedup by team pair).
    const teamPairKey = r.home && r.away ? `${r.home}|${r.away}` : null;
    const existingId = teamPairKey ? byTeamPair.get(teamPairKey) : null;
    const resolvedId = existingId ?? r.id;

    const ex = byId.get(resolvedId);
    if (ex) {
      // Don't overwrite a manually-set FT with a non-FT feed status.
      if (ex.status === "FT" && r.status !== "FT") continue;
      byId.set(resolvedId, {
        ...ex,
        homeScore: r.homeScore ?? ex.homeScore,
        awayScore: r.awayScore ?? ex.awayScore,
        homePens: r.homePens ?? ex.homePens,
        awayPens: r.awayPens ?? ex.awayPens,
        status: r.status,
        stage: r.stage ?? ex.stage,
      });
    } else if (r.home && r.away && r.stage) {
      // New knockout fixture from the feed — add it.
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
      // Register this team pair so future duplicates resolve to this ID.
      if (teamPairKey) byTeamPair.set(teamPairKey, r.id);
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
