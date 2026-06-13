"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Radio, RefreshCw, Trophy } from "lucide-react";

import Leaderboard from "@/components/Leaderboard";
import MatchesPanel from "@/components/MatchesPanel";
import ResultsPanel from "@/components/ResultsPanel";
import ScoringPanel from "@/components/ScoringPanel";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { londonDayKey, matchKickoff } from "@/lib/format";
import type { LivePayload } from "@/lib/standings";

const POLL_MS = 60_000;
// Manual fresh refreshes bypass the feed cache (9 direct API calls), so rate-limit
// the button — TheSportsDB's free key 429s under bursts and live data drops out.
const MANUAL_COOLDOWN_MS = 15_000;

export default function Dashboard({ initial }: { initial: LivePayload }) {
  const [data, setData] = useState<LivePayload>(initial);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [coolingDown, setCoolingDown] = useState(false);
  const aliveRef = useRef(true);

  const tick = useCallback(async (fresh = false) => {
    if (fresh) {
      setCoolingDown(true);
      setTimeout(() => {
        if (aliveRef.current) setCoolingDown(false);
      }, MANUAL_COOLDOWN_MS);
    }
    setRefreshing(true);
    try {
      const res = await fetch(fresh ? "/api/standings?fresh=1" : "/api/standings", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = (await res.json()) as LivePayload;
      if (aliveRef.current) {
        setData(json);
        setRefreshedAt(
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      }
    } catch {
      // Keep last good data.
    } finally {
      if (aliveRef.current) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    const id = setInterval(() => tick(), POLL_MS);
    return () => {
      aliveRef.current = false;
      clearInterval(id);
    };
  }, [tick]);

  const { standings, matches } = data;
  const owners = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of standings.players) for (const t of p.teams) map[t.team] = p.player;
    return map;
  }, [standings]);
  const { liveMatches, playedMatches, totalMatches } = standings.meta;
  const live = liveMatches > 0;
  const todayCount = useMemo(() => {
    const todayKey = londonDayKey(new Date());
    return matches.filter((m) => {
      const kickoff = matchKickoff(m.date, m.time);
      return kickoff !== null && londonDayKey(kickoff) === todayKey;
    }).length;
  }, [matches]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative overflow-hidden border-b border-primary/15">
        <div className="pitch-stripes absolute inset-0" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-background"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-2xl px-4 pb-10 pt-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">
            FIFA World Cup 2026
          </p>
          <h1 className="text-glow-gold mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-wide sm:text-5xl">
            World Cup
            <span className="px-2 text-primary sm:px-3">Sweepstake</span>
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            🇺🇸 United States · 🇨🇦 Canada · 🇲🇽 México
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2">
            {live ? (
              <Badge variant="live" className="px-3 py-1">
                <span className="size-2 animate-live-pulse rounded-full bg-[hsl(var(--live))]" />
                {liveMatches} match{liveMatches > 1 ? "es" : ""} live
              </Badge>
            ) : (
              <Badge variant="secondary" className="px-3 py-1 font-medium text-muted-foreground">
                <Radio className="size-3" />
                {todayCount > 0
                  ? `${todayCount} match${todayCount > 1 ? "es" : ""} today`
                  : "No matches in play"}
              </Badge>
            )}
            <Badge variant="gold" className="px-3 py-1">
              <Trophy className="size-3" />
              {playedMatches}/{totalMatches} played
            </Badge>
            <button
              type="button"
              onClick={() => tick(true)}
              disabled={refreshing || coolingDown}
              aria-label="Refresh now"
              className="disabled:opacity-60"
            >
              <Badge
                variant="secondary"
                className="px-3 py-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <RefreshCw className={cn("size-3", refreshing && "animate-spin")} />
                {refreshedAt ? `updated ${refreshedAt}` : "refresh"}
              </Badge>
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" aria-label="Scoring rules">
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <BookOpen className="size-3" />
                    rules
                  </Badge>
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-left text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    How scoring works
                  </DialogTitle>
                </DialogHeader>
                <ScoringPanel />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16">
        <Tabs defaultValue="standings" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          <TabsContent value="standings" className="mt-4">
            <Leaderboard standings={standings} matches={matches} />
          </TabsContent>
          <TabsContent value="matches" className="mt-4">
            <MatchesPanel matches={matches} owners={owners} />
          </TabsContent>
          <TabsContent value="results" className="mt-4">
            <ResultsPanel matches={matches} owners={owners} />
          </TabsContent>
        </Tabs>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Auto-refreshes every 60s ·{" "}
          <a href="/api/standings" className="underline underline-offset-2 hover:text-foreground">
            JSON API
          </a>
        </footer>
      </main>
    </div>
  );
}
