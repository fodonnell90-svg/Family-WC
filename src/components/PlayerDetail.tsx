"use client";

import Image from "next/image";
import { BarChart3, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, formatMatchDate } from "@/lib/format";
import type { Match, PlayerStanding, TeamScore } from "@/lib/types";

function TeamBadge({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return <span className="size-6 rounded-sm bg-muted" />;
  return <Image src={src} alt={alt} width={24} height={24} className="size-6 object-contain" />;
}

function BreakdownLine({ label, detail, points }: { label: string; detail: string; points: number }) {
  return (
    <div className="flex items-center justify-between py-1 text-xs">
      <span className="text-muted-foreground">
        {label}
        <span className="ml-1.5 text-foreground/80">{detail}</span>
      </span>
      <span
        className={cn(
          "font-display font-bold tabular-nums",
          points > 0 ? "text-primary" : "text-muted-foreground"
        )}
      >
        +{points}
      </span>
    </div>
  );
}

function TeamMatches({ team, matches }: { team: string; matches: Match[] }) {
  const played = matches.filter(
    (m) => (m.home === team || m.away === team) && m.status !== "NS"
  );
  if (played.length === 0) {
    return <p className="py-1 text-xs text-muted-foreground">No matches played yet.</p>;
  }
  return (
    <div className="flex flex-col">
      {played.map((m) => {
        const isHome = m.home === team;
        const own = isHome ? m.homeScore : m.awayScore;
        const opp = isHome ? m.awayScore : m.homeScore;
        const won = own !== null && opp !== null && own > opp;
        const drew = own !== null && opp !== null && own === opp;
        return (
          <div key={m.id} className="flex items-center justify-between py-1 text-xs">
            <span className="truncate text-muted-foreground">
              {STAGE_LABEL[m.stage] ?? m.stage} · vs {isHome ? m.away : m.home}
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              {m.status === "LIVE" && (
                <span className="size-1.5 animate-live-pulse rounded-full bg-[hsl(var(--live))]" />
              )}
              <span
                className={cn(
                  "font-bold tabular-nums",
                  won && "text-tier-1",
                  drew && "text-primary",
                  !won && !drew && "text-muted-foreground"
                )}
              >
                {own ?? "–"}–{opp ?? "–"}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TeamDetail({ ts, matches }: { ts: TeamScore; matches: Match[] }) {
  const b = ts.breakdown;
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3">
      <div className="flex items-center gap-2.5">
        <TeamBadge src={ts.badge} alt={ts.team} />
        <span className="min-w-0 flex-1 truncate text-sm font-bold">{ts.team}</span>
        <span className="font-display text-lg font-bold tabular-nums text-primary">{b.total}</span>
      </div>
      <div className="mt-2 border-t border-border/60 pt-1.5">
        <BreakdownLine label="Goals" detail={`${b.goals} scored`} points={b.goalPoints} />
        <BreakdownLine
          label="Results"
          detail={`${b.wins}W ${b.draws}D`}
          points={b.resultPoints}
        />
      </div>
      <div className="mt-1.5 border-t border-border/60 pt-1.5">
        <TeamMatches team={ts.team} matches={matches} />
      </div>
    </div>
  );
}

function TeamFixtures({ ts, matches }: { ts: TeamScore; matches: Match[] }) {
  const upcoming = matches.filter(
    (m) => (m.home === ts.team || m.away === ts.team) && m.status === "NS"
  );
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3">
      <div className="flex items-center gap-2.5">
        <TeamBadge src={ts.badge} alt={ts.team} />
        <span className="min-w-0 flex-1 truncate text-sm font-bold">{ts.team}</span>
        {ts.group && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Grp {ts.group}
          </span>
        )}
      </div>
      <div className="mt-2 border-t border-border/60 pt-1.5">
        {upcoming.length === 0 ? (
          <p className="py-1 text-xs text-muted-foreground">No fixtures scheduled.</p>
        ) : (
          upcoming.map((m) => {
            const isHome = m.home === ts.team;
            return (
              <div key={m.id} className="flex items-center justify-between gap-3 py-1 text-xs">
                <span className="truncate text-muted-foreground">
                  {STAGE_LABEL[m.stage] ?? m.stage} · vs{" "}
                  <span className="text-foreground/80">{isHome ? m.away : m.home}</span>
                  <span className="ml-1 text-muted-foreground/70">{isHome ? "(H)" : "(A)"}</span>
                </span>
                <span className="shrink-0 font-medium tabular-nums text-foreground/80">
                  {formatMatchDate(m.date, m.time)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function PlayerDetail({
  player,
  matches,
}: {
  player: PlayerStanding;
  matches: Match[];
}) {
  return (
    <div className="mt-2 flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="flex-1 text-muted-foreground">
            <BarChart3 />
            Previous results
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {player.player}
              <span className="ml-2 text-primary">{player.total} pts</span>
            </DialogTitle>
            <DialogDescription>
              Rank {player.rank} · point-by-point breakdown across all {player.teams.length} teams.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {player.teams.map((ts) => (
              <TeamDetail key={ts.team} ts={ts} matches={matches} />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="flex-1 text-muted-foreground">
            <CalendarDays />
            Next fixtures
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {player.player}
              <span className="ml-2 text-primary">fixtures</span>
            </DialogTitle>
            <DialogDescription>
              Upcoming matches for {player.player}&apos;s {player.teams.length} teams · UK time.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {player.teams.map((ts) => (
              <TeamFixtures key={ts.team} ts={ts} matches={matches} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
