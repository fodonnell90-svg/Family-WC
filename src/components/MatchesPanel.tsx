"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, formatMatchDate, londonDayKey, matchKickoff } from "@/lib/format";
import type { Match } from "@/lib/types";

const UPCOMING_LIMIT = 12;

function TeamCell({
  name,
  badge,
  align,
}: {
  name: string;
  badge: string | null;
  align: "left" | "right";
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2",
        align === "right" && "flex-row-reverse"
      )}
    >
      {badge ? (
        <Image src={badge} alt="" width={24} height={24} className="size-6 shrink-0 object-contain" />
      ) : (
        <span className="size-6 shrink-0 rounded-sm bg-muted" />
      )}
      <span className={cn("truncate text-sm font-semibold", align === "right" && "text-right")}>
        {name}
      </span>
    </span>
  );
}

type Owners = Record<string, string>;

function MatchRow({ match, owners }: { match: Match; owners: Owners }) {
  const played = match.status === "FT";
  const live = match.status === "LIVE";
  const hasScore = match.homeScore !== null && match.awayScore !== null;
  const homeOwner = owners[match.home];
  const awayOwner = owners[match.away];

  return (
    <div className="flex flex-col gap-2 border-b border-border/50 py-3 last:border-b-0">
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>{STAGE_LABEL[match.stage] ?? match.stage}</span>
        <span className="flex items-center gap-2">
          {live && (
            <Badge variant="live" className="px-1.5 py-0 text-[9px]">
              <span className="size-1.5 animate-live-pulse rounded-full bg-[hsl(var(--live))]" />
              Live
            </Badge>
          )}
          {formatMatchDate(match.date, match.time)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <TeamCell name={match.home} badge={match.homeBadge} align="right" />
        <span
          className={cn(
            "shrink-0 rounded-md bg-secondary px-2.5 py-1 font-display text-sm font-bold tabular-nums",
            live && "bg-live/15 text-[hsl(var(--live))]",
            played && "text-primary"
          )}
        >
          {hasScore ? `${match.homeScore} – ${match.awayScore}` : "vs"}
        </span>
        <TeamCell name={match.away} badge={match.awayBadge} align="left" />
      </div>
      {match.venue && (
        <div className="text-center text-[10px] text-muted-foreground">
          {match.venue}
          {match.city ? ` · ${match.city}` : ""}
        </div>
      )}
      {(homeOwner || awayOwner) && (
        <div className="text-center text-[10px] font-semibold uppercase tracking-wider">
          <span className="text-primary/90">{homeOwner ?? "Unclaimed"}</span>
          <span className="mx-1.5 font-medium normal-case text-muted-foreground">vs</span>
          <span className="text-primary/90">{awayOwner ?? "Unclaimed"}</span>
        </div>
      )}
    </div>
  );
}

export function MatchSection({
  title,
  matches,
  owners,
}: {
  title: string;
  matches: Match[];
  owners: Owners;
}) {
  if (matches.length === 0) return null;
  return (
    <Card className="animate-rise">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {matches.map((m) => (
          <MatchRow key={m.id} match={m} owners={owners} />
        ))}
      </CardContent>
    </Card>
  );
}

export default function MatchesPanel({
  matches,
  owners,
}: {
  matches: Match[];
  owners: Owners;
}) {
  const todayKey = londonDayKey(new Date());
  const isToday = (m: Match) => {
    const kickoff = matchKickoff(m.date, m.time);
    return kickoff !== null && londonDayKey(kickoff) === todayKey;
  };

  const today = matches.filter(isToday);
  const todayIds = new Set(today.map((m) => m.id));
  const rest = matches.filter((m) => !todayIds.has(m.id));

  const live = rest.filter((m) => m.status === "LIVE");
  const upcoming = rest.filter((m) => m.status === "NS").slice(0, UPCOMING_LIMIT);

  return (
    <div className="flex flex-col gap-4">
      <MatchSection title="Live now" matches={live} owners={owners} />
      <MatchSection title="Today" matches={today} owners={owners} />
      <MatchSection title="Up next" matches={upcoming} owners={owners} />
      {live.length === 0 && today.length === 0 && upcoming.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">No matches to show yet.</p>
      )}
    </div>
  );
}
