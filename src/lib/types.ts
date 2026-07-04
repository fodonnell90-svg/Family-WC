// Domain types for the World Cup sweepstake.

export type Stage =
  | "group-1"
  | "group-2"
  | "group-3"
  | "round-32"
  | "round-16"
  | "quarter"
  | "semi"
  | "final";

export type MatchStatus = "NS" | "LIVE" | "FT";

export interface Match {
  id: string;
  date: string;
  time: string | null;
  timestamp: string | null;
  group: string | null;
  round: "group" | "knockout";
  stage: string;
  home: string;
  away: string;
  homeBadge: string | null;
  awayBadge: string | null;
  venue: string | null;
  city: string | null;
  homeScore: number | null;
  awayScore: number | null;
  homePens: number | null;
  awayPens: number | null;
  status: MatchStatus;
}

export interface Team {
  name: string;
  group: string | null;
  badge: string | null;
  tier: number;
}

export interface Draw {
  seed: string;
  players: string[];
  assignments: Record<string, string[]>;
}

export type Progression =
  | "none"
  | "group"
  | "round-16"
  | "quarter"
  | "semi"
  | "winner";

export interface PointsBreakdown {
  goals: number;
  goalPoints: number;
  wins: number;
  draws: number;
  resultPoints: number;
  progression: Progression;
  progressionPoints: number;
  total: number;
}

export interface TeamScore {
  team: string;
  tier: number;
  badge: string | null;
  group: string | null;
  breakdown: PointsBreakdown;
}

export interface PlayerStanding {
  player: string;
  rank: number;
  total: number;
  teams: TeamScore[];
}

export interface Standings {
  updatedAt: string;
  players: PlayerStanding[];
  meta: {
    totalMatches: number;
    playedMatches: number;
    liveMatches: number;
  };
}
