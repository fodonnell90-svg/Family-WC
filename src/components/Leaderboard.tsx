"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Goal } from "lucide-react";

import PlayerDetail from "@/components/PlayerDetail";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PROGRESSION_LABEL } from "@/lib/format";
import type { Match, Standings, TeamScore } from "@/lib/types";

const TIER_CLASS: Record<number, string> = {
  1: "bg-tier-1",
  2: "bg-tier-2",
  3: "bg-tier-3",
  4: "bg-tier-4",
  5: "bg-tier-5",
  6: "bg-tier-6",
};

const RANK_CLASS: Record<number, string> = {
  1: "bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--gold)/0.45)]",
  2: "bg-zinc-300 text-zinc-900",
  3: "bg-amber-700 text-amber-50",
};

function Flag({ src, alt, size = "md" }: { src: string | null; alt: string; size?: "sm" | "md" }) {
  const px = size === "sm" ? 20 : 28;
  if (!src) return <span className="inline-block size-5 rounded-sm bg-muted" />;
  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      className={cn("shrink-0 object-contain", size === "sm" ? "size-5" : "size-7")}
    />
  );
}

function LiveDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 animate-live-pulse rounded-full bg-[hsl(var(--live))]",
        className
      )}
      title="Playing now"
      aria-label="Playing now"
    />
  );
}

function TeamRow({ ts, isLive }: { ts: TeamScore; isLive: boolean }) {
  const b = ts.breakdown;
  return (
    <div className="flex items-center gap-3 border-b border-border/50 px-1 py-2.5 last:border-b-0">
      <Flag src={ts.badge} alt={ts.team} />
      <span
        className={cn(
          "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold text-white",
          TIER_CLASS[ts.tier] ?? "bg-tier-6"
        )}
      >
        T{ts.tier}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
        {ts.team}
        {isLive && <LiveDot className="mb-px ml-1.5" />}
        {ts.group && (
          <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Grp {ts.group}
          </span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-2.5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1" title="Goals scored">
          <Goal className="size-3" />
          <b className="text-foreground">{b.goals}</b>
        </span>
        <span className="max-[420px]:hidden" title="Wins · Draws">
          <b className="text-foreground">{b.wins}</b>W <b className="text-foreground">{b.draws}</b>
          D
        </span>
        {b.progression !== "none" && (
          <Badge variant="gold" className="px-1.5 py-0 text-[9px] uppercase tracking-wider">
            {PROGRESSION_LABEL[b.progression]}
          </Badge>
        )}
      </span>
      <span className="w-9 shrink-0 text-right text-sm font-bold tabular-nums">{b.total}</span>
    </div>
  );
}

export default function Leaderboard({
  standings,
  matches,
}: {
  standings: Standings;
  matches: Match[];
}) {
  const leaderTotal = standings.players[0]?.total ?? 0;
  const leader = standings.players.find((p) => p.rank === 1);
  const liveTeams = useMemo(() => {
    const set = new Set<string>();
    for (const m of matches) {
      if (m.status !== "LIVE") continue;
      set.add(m.home);
      set.add(m.away);
    }
    return set;
  }, [matches]);

  return (
    <Accordion
      type="multiple"
      defaultValue={leader ? [leader.player] : []}
      className="flex flex-col gap-3"
    >
      {standings.players.map((p, i) => {
        const pct = leaderTotal > 0 ? Math.round((p.total / leaderTotal) * 100) : 0;
        return (
          <AccordionItem
            key={p.player}
            value={p.player}
            style={{ animationDelay: `${i * 60}ms` }}
            className={cn(
              "animate-rise rounded-xl border bg-card px-4 ring-1 ring-foreground/5",
              p.rank === 1 && leaderTotal > 0 && "border-primary/40 ring-primary/20"
            )}
          >
            <AccordionTrigger className="gap-3 py-3.5 hover:no-underline">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg bg-secondary font-display text-sm font-bold text-muted-foreground",
                  RANK_CLASS[p.rank]
                )}
              >
                {p.rank}
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-base font-bold">{p.player}</span>
                <span className="mt-1.5 flex items-center gap-1">
                  {p.teams.map((t) => (
                    <span key={t.team} className="relative">
                      <Flag src={t.badge} alt={t.team} size="sm" />
                      {liveTeams.has(t.team) && (
                        <LiveDot className="absolute -right-0.5 -top-0.5 ring-2 ring-card" />
                      )}
                    </span>
                  ))}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="font-display text-2xl font-bold tabular-nums text-primary">
                  {p.total}
                </span>
                <span className="ml-1 text-[10px] font-semibold uppercase text-muted-foreground">
                  pts
                </span>
                <Progress value={pct} className="mt-1.5 h-1 w-20" />
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="border-t pt-1">
                {p.teams.map((ts) => (
                  <TeamRow key={ts.team} ts={ts} isLive={liveTeams.has(ts.team)} />
                ))}
                <PlayerDetail player={p} matches={matches} />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
