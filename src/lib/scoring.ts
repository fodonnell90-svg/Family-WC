import type {
  Draw,
  Match,
  PlayerStanding,
  PointsBreakdown,
  Standings,
  Team,
  TeamScore,
} from "./types";

// ----------------------------------------------------------------------------
// SCORING CONFIG
// Goals: 1pt each (regular time + extra time only, NOT penalty shootout goals)
// Win: 3pts (including winning a penalty shootout)
// Draw: 1pt (group stage only — no draws in knockout)
// ----------------------------------------------------------------------------
export const SCORING = {
  goalPoint: 1,
  win: 3,
  draw: 1,
} as const;

const KO_ORDER = ["round-32", "round-16", "quarter", "semi", "final"] as const;

function isFinished(m: Match): boolean {
  return m.status === "FT" && m.homeScore !== null && m.awayScore !== null;
}

function isScorable(m: Match): boolean {
  return (
    (m.status === "FT" || m.status === "LIVE") &&
    m.homeScore !== null &&
    m.awayScore !== null
  );
}

// In knockout matches that go to penalties, homeScore/awayScore are level.
// We use homePens/awayPens to determine who won the shootout.
function knockoutWinner(m: Match): "home" | "away" | null {
  if (m.round !== "knockout") return null;
  // Won in regular time or ET
  if ((m.homeScore ?? 0) > (m.awayScore ?? 0)) return "home";
  if ((m.awayScore ?? 0) > (m.homeScore ?? 0)) return "away";
  // Level after ET — check penalty shootout
  if (m.homePens !== null && m.awayPens !== null) {
    if (m.homePens > m.awayPens) return "home";
    if (m.awayPens > m.homePens) return "away";
  }
  // Still live/unknown
  return null;
}

function scoreTeam(team: Team, matches: Match[]): TeamScore {
  let goals = 0;
  let wins = 0;
  let draws = 0;

  for (const m of matches) {
    if (!isScorable(m)) continue;
    const isHome = m.home === team.name;
    const isAway = m.away === team.name;
    if (!isHome && !isAway) continue;

    // Goals: use homeScore/awayScore which is the score after 90 or 120 mins.
    // This never includes penalty shootout goals — those are in homePens/awayPens.
    const own = isHome ? (m.homeScore as number) : (m.awayScore as number);
    const opp = isHome ? (m.awayScore as number) : (m.homeScore as number);
    goals += own;

    if (m.round === "knockout") {
      // Knockout: no draws. Winner gets 3pts, loser gets 0.
      const winner = knockoutWinner(m);
      if ((isHome && winner === "home") || (isAway && winner === "away")) {
        wins += 1;
      }
    } else {
      // Group stage
      if (own > opp) wins += 1;
      else if (own === opp) draws += 1;
    }
  }

  const goalPoints = goals * SCORING.goalPoint;
  const resultPoints = wins * SCORING.win + draws * SCORING.draw;

  const breakdown: PointsBreakdown = {
    goals,
    goalPoints,
    wins,
    draws,
    resultPoints,
    progression: "none",
    progressionPoints: 0,
    total: goalPoints + resultPoints,
  };

  return {
    team: team.name,
    tier: team.tier,
    badge: team.badge,
    group: team.group,
    breakdown,
  };
}

export function computeStandings(
  draw: Draw,
  teams: Team[],
  matches: Match[],
): Standings {
  const teamByName = new Map(teams.map((t) => [t.name, t]));

  const players: PlayerStanding[] = draw.players.map((player) => {
    const teamNames = draw.assignments[player] ?? [];
    const teamScores = teamNames
      .map((name) => teamByName.get(name))
      .filter((t): t is Team => Boolean(t))
      .map((t) => scoreTeam(t, matches))
      .sort((a, b) => b.breakdown.total - a.breakdown.total || a.tier - b.tier);

    const total = teamScores.reduce((sum, ts) => sum + ts.breakdown.total, 0);
    return { player, rank: 0, total, teams: teamScores };
  });

  players.sort((a, b) => b.total - a.total || a.player.localeCompare(b.player));

  let lastTotal: number | null = null;
  let lastRank = 0;
  players.forEach((p, i) => {
    if (p.total === lastTotal) {
      p.rank = lastRank;
    } else {
      p.rank = i + 1;
      lastRank = p.rank;
      lastTotal = p.total;
    }
  });

  const playedMatches = matches.filter(isFinished).length;
  const liveMatches = matches.filter((m) => m.status === "LIVE").length;

  return {
    updatedAt: new Date().toISOString(),
    players,
    meta: {
      totalMatches: matches.length,
      playedMatches,
      liveMatches,
    },
  };
}

export { KO_ORDER };
