# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Live standings for a 9-person 2026 World Cup sweepstake. Next.js 16 (App Router) +
Tailwind 3 + shadcn/ui, mobile-first, deploys to Vercel. Real fixtures/teams from
TheSportsDB; live scores are **polled** (no webhooks, no paid API key).

## Commands

Use **pnpm only** (lockfile is pnpm; do not introduce npm/yarn).

```bash
pnpm dev        # dev server at http://localhost:3000
pnpm build      # production build
pnpm check      # typecheck (tsc --noEmit) — also `pnpm typecheck`
pnpm lint       # eslint
pnpm format     # prettier --write .
pnpm refresh    # poll TheSportsDB → write data/results.json (scripts/refresh-results.mjs)
```

There is no test suite. Verify changes with `pnpm check` + `pnpm lint`.

## Architecture

The whole app is a read-through pipeline from JSON data files → computed standings →
one dashboard. There is no database and no auth.

**Data flow (the big picture):**
1. `src/lib/data.ts` — reads `data/*.json` from disk. `loadMatches()` merges committed
   `fixtures.json` with `results.json` overrides (overrides win, and can *introduce*
   new knockout fixtures not present at draw time).
2. `src/lib/live.ts` — `fetchLiveResults()` polls TheSportsDB by round. Degrades
   gracefully: if the feed is unreachable, callers fall back to committed + manual data
   and the app **never hard-fails on the third party**.
3. `src/lib/standings.ts` — `getLivePayload()` is the **single assembly point** so the
   page and the API route can never drift. It merges live results onto base matches
   (`mergeLive`) then computes standings.
4. `src/lib/scoring.ts` — `computeStandings()` is the pure scoring core. Progression is
   *derived* from finished matches (a team "reached" a stage if it appears in any match
   of that stage; winner = won side of a finished `final`).

**Consumers:** `src/app/page.tsx` (SSR, `force-dynamic`) and
`src/app/api/standings/route.ts` (`GET /api/standings`, `?live=0` for committed-only)
both call `getLivePayload()`. The browser re-fetches `/api/standings` every 60s.

**Two merge layers, same shape, both keyed by match id** — keep them in sync if you
change `Match`: `loadMatches` (data.ts, file overrides) and `mergeLive` (standings.ts,
feed overrides). Both also append feed/override-only knockout fixtures as the bracket fills in.

## Scoring rules — single source of truth

All point values and toggles live in the `SCORING` object at the top of
`src/lib/scoring.ts`. Edit there to retune; nothing else hardcodes points.
- Goals: 1 each (all stages). Group win: 3, group draw: 1 (**group stage only**).
- Progression ladder: qualify/R32 2, R16 3, QF 4, SF 5, winner 6.
- `cumulativeProgression: true` banks every milestone (winner = 20 prog pts);
  `false` awards only the highest stage reached.
- WC2026 has a Round of 32; `qualifyGroup` means surviving the group into R32.

## Data files (`data/`)

- `teams.json` — 48 teams with group + tier + flag badge (generated, real).
- `fixtures.json` — 72 group matches, real dates/venues. **Kickoff `date`/`time`/`timestamp`
  are stored in UTC** (as TheSportsDB provides them). `formatMatchDate` (src/lib/format.ts)
  appends `Z` and renders in `Europe/London`, so the displayed time is already the correct
  UK/BST kickoff. ⚠️ Do NOT add an hour to "convert to UK time" — the stored value is UTC by
  design and the display layer does the conversion (e.g. opener `19:00:00` → shows `20:00`).
- `tiers.json` — tier → team list, seeded by FIFA ranking (5 tiers of 9 = 45 teams;
  each player gets one team per tier = 5 teams). 48 teams don't split 9 ways, so the
  3 lowest-ranked teams (Curaçao, Haiti, New Zealand) are DROPPED from the pool and
  marked `tier: 0` in `teams.json` (they still play their group fixtures, just unowned).
  Regenerate via `node scripts/regen-draw.mjs`. EDITABLE — sanity-check it.
- `draw.json` — seeded, committed player→teams assignment so it never reshuffles on
  deploy. Players are placeholders (`Player A`–`Player I`) — rename here.
- `results.json` — manual/poller score+status overrides keyed by match id. The editable
  source of truth for live data. Currently empty (`{}`); fill via `pnpm refresh` or by hand.

## Live refresh

`pnpm refresh` writes `data/results.json` from the feed; manually-set scores are
preserved unless the feed has a finished (FT) result. A `vercel.json` cron hits
`/api/standings?live=1` every 10 min to keep the serverless cache warm. For persisted
overrides, hand-edit `data/results.json` and commit.

## Conventions

Follows a standard Next 16 + Tailwind 3 + shadcn/ui house style.
UI primitives under `src/components/ui/` are shadcn-generated — add new ones via the
shadcn CLI rather than hand-rolling. Path alias `@/*` → `src/*`.
