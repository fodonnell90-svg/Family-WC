# World Cup 2026 Sweepstake — Live Standings

A self-hosted live leaderboard for a **24-person 2026 World Cup Sweepstake**.
Each player has 2 teams, points roll in automatically as matches
finish, and a phone-friendly dashboard shows the standings in real time.

- **Stack:** Next.js 16 (App Router) + Tailwind CSS + shadcn/ui — mobile-first.
- **Data:** Real fixtures/teams/groups from [TheSportsDB](https://www.thesportsdb.com/).
  Live scores are **polled** — no webhooks, no paid API key, no env vars.
- **Deploy:** Anywhere that runs Next.js. Vercel is the zero-config path.
- **Installable:** It's a PWA — open it on your phone and "Add to Home Screen"
  for an app-like icon and full-screen view.

---

## Scoring

- **Goal scored:** +1 (all stages)
- **Win:** +3
- **Draw:** +1

---

## How live scores work

There's no setup and no API key. At request time the app polls TheSportsDB by
round, merges those results onto the committed fixtures, and computes standings.
If the feed is unreachable it falls back to the bundled fixtures plus
`data/results.json` — **it never hard-fails because of a third party.** The
browser re-fetches every 60 seconds.

To pull and persist the latest scores yourself:

```bash
pnpm refresh    # writes data/results.json from the live feed
```

Manually-set scores in `data/results.json` are preserved unless the feed has a
finished (FT) result for that match. You can also hand-edit `data/results.json`
to fix or pre-set any result — it's keyed by match id.

---

## Data files (`data/`)

- **`teams.json`** — 48 teams with group, tier, and flag badge.
- **`fixtures.json`** — 72 group matches with real dates/venues. Kickoff times
  are stored in **UTC**; the app renders them in UK/Irish time (`Europe/London`).
- **`draw.json`** — the committed player → teams assignment (24 players, 2 teams each).
- **`results.json`** — live/manual score + status overrides, keyed by match id.
  Starts empty (`{}`).

---

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected.
3. No environment variables are required. Deploy.

---

## API

- `GET /api/standings` → `{ standings, matches }` (live-merged).
- `GET /api/standings?live=0` → committed + manual data only (no live poll).
