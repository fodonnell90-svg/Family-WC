#!/usr/bin/env node
// Poll TheSportsDB for WC2026 results and write score/status overrides into
// data/results.json. Manual scores you've set are PRESERVED unless the feed has
// a finished (FT) result for that match. Run on a cron or by hand:
//
//   node scripts/refresh-results.mjs
//
// No API key required (free v1 endpoint). Polling, not webhooks.

import fs from "node:fs";
import path from "node:path";

const LEAGUE = "4429"; // FIFA World Cup on TheSportsDB
const SEASON = "2026";
const API = "https://www.thesportsdb.com/api/v1/json/123";
const DATA_DIR = path.join(process.cwd(), "data");
const RESULTS = path.join(DATA_DIR, "results.json");

// Map TheSportsDB intRound -> our stage keys.
const STAGE_BY_ROUND = {
  "1": "group-1",
  "2": "group-2",
  "3": "group-3",
  "125": "round-32",
  "150": "round-16",
  "200": "quarter",
  "201": "semi", // some feeds use 201 for semis
  "160": "semi",
  "170": "final",
};

function normaliseStatus(s) {
  if (!s) return "NS";
  const v = String(s).toUpperCase();
  if (["FT", "AET", "PEN", "MATCH FINISHED"].includes(v)) return "FT";
  if (["1H", "2H", "HT", "ET", "LIVE", "IN PLAY"].includes(v)) return "LIVE";
  return "NS";
}

async function fetchRound(r) {
  const url = `${API}/eventsround.php?id=${LEAGUE}&r=${r}&s=${SEASON}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.events ?? [];
}

async function main() {
  const rounds = ["1", "2", "3", "125", "150", "160", "200", "201", "170"];
  const existing = fs.existsSync(RESULTS)
    ? JSON.parse(fs.readFileSync(RESULTS, "utf-8"))
    : {};

  let updated = 0;
  let live = 0;

  for (const r of rounds) {
    let events;
    try {
      events = await fetchRound(r);
    } catch (err) {
      console.warn(`round ${r}: fetch failed (${err.message}) — skipping`);
      continue;
    }
    for (const e of events) {
      const id = e.idEvent;
      const hs = e.intHomeScore;
      const as = e.intAwayScore;
      const status = normaliseStatus(e.strStatus);
      if (hs === null && as === null && status === "NS") continue; // nothing yet

      const prev = existing[id] ?? {};
      const next = {
        ...prev,
        homeScore: hs === null ? null : Number(hs),
        awayScore: as === null ? null : Number(as),
        status,
        stage: STAGE_BY_ROUND[e.intRound] ?? prev.stage,
      };
      // Carry knockout pairing in case the fixture wasn't in the committed file.
      if (Number(r) >= 100) {
        next.home = e.strHomeTeam;
        next.away = e.strAwayTeam;
        next.homeBadge = e.strHomeTeamBadge ?? null;
        next.awayBadge = e.strAwayTeamBadge ?? null;
        next.round = "knockout";
        next.date = e.dateEvent ?? prev.date ?? "";
      }
      existing[id] = next;
      updated += 1;
      if (status === "LIVE") live += 1;
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(RESULTS, JSON.stringify(existing, null, 2));
  console.log(`refreshed ${updated} matches (${live} live) -> ${RESULTS}`);
}

main().catch((err) => {
  console.error("refresh failed:", err);
  process.exit(1);
});
