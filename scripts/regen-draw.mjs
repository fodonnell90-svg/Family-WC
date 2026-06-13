#!/usr/bin/env node
// One-shot regenerator for the 9-player sweepstake. 48 teams don't split evenly
// 9 ways (48 = 9*5 + 3), so we DROP the 3 lowest FIFA-ranked teams and re-band
// the remaining 45 into 5 tiers of 9. Each of the 9 players drafts one team per
// tier = 5 balanced teams. Seeded + deterministic so it never reshuffles.
//
//   node scripts/regen-draw.mjs
//
// Rewrites data/tiers.json, data/draw.json, and the tier field in data/teams.json.

import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SEED = "wc2026-sweepstake-9p-v3";

// Lowest-ranked 3 by FIFA Men's World Ranking (April 2026): Curaçao 82,
// Haiti 83, New Zealand 85. Dropped from the pool entirely.
const DROPPED = ["Curaçao", "Haiti", "New Zealand"];

// 45 teams in FIFA-ranking order, re-banded into 5 tiers of 9 (derived from the
// previous 6-tiers-of-8 seeding with the 3 dropped teams removed).
const TIERS = {
  tier1: ["France", "Spain", "Argentina", "England", "Portugal", "Brazil", "Netherlands", "Morocco", "Belgium"],
  tier2: ["Germany", "Croatia", "Colombia", "Senegal", "Mexico", "USA", "Uruguay", "Japan", "Switzerland"],
  tier3: ["Iran", "Turkey", "Ecuador", "Austria", "South Korea", "Australia", "Algeria", "Egypt", "Canada"],
  tier4: ["Norway", "Panama", "Ivory Coast", "Sweden", "Paraguay", "Czech Republic", "Scotland", "Tunisia", "DR Congo"],
  tier5: ["Uzbekistan", "Qatar", "Iraq", "South Africa", "Saudi Arabia", "Jordan", "Bosnia-Herzegovina", "Cape Verde", "Ghana"],
};

const PLAYERS = ["Player A", "Player B", "Player C", "Player D", "Player E", "Player F", "Player G", "Player H", "Player I"];

// Deterministic seeded RNG (mulberry32 seeded from a string hash) — no Date/random,
// so re-running produces an identical draw.
function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(hashSeed(SEED));

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sanity: 45 unique teams, none dropped, none duplicated.
const pool = Object.values(TIERS).flat();
if (pool.length !== 45) throw new Error(`expected 45 teams, got ${pool.length}`);
if (new Set(pool).size !== 45) throw new Error("duplicate team in tiers");
for (const d of DROPPED) if (pool.includes(d)) throw new Error(`dropped team still in pool: ${d}`);

// Draft: independent seeded shuffle per tier, team[i] -> player[i]. Every player
// ends with exactly one team from each strength band.
const assignments = Object.fromEntries(PLAYERS.map((p) => [p, []]));
for (const tierTeams of Object.values(TIERS)) {
  const order = shuffled(tierTeams);
  order.forEach((team, i) => assignments[PLAYERS[i]].push(team));
}

const draw = { seed: SEED, players: PLAYERS, assignments };

// Update teams.json tier bands: 1-5 for the 45 in-pool teams, 0 for the 3 dropped.
const teamsPath = path.join(DATA_DIR, "teams.json");
const teams = JSON.parse(fs.readFileSync(teamsPath, "utf-8"));
const tierOf = new Map();
Object.entries(TIERS).forEach(([key, list]) => {
  const n = Number(key.replace("tier", ""));
  list.forEach((t) => tierOf.set(t, n));
});
for (const team of teams) {
  team.tier = DROPPED.includes(team.name) ? 0 : tierOf.get(team.name) ?? 0;
}
const unmatched = teams.filter((t) => t.tier === 0 && !DROPPED.includes(t.name));
if (unmatched.length) throw new Error(`teams not in any tier: ${unmatched.map((t) => t.name).join(", ")}`);

fs.writeFileSync(path.join(DATA_DIR, "tiers.json"), JSON.stringify(TIERS, null, 2) + "\n");
fs.writeFileSync(path.join(DATA_DIR, "draw.json"), JSON.stringify(draw, null, 2) + "\n");
fs.writeFileSync(teamsPath, JSON.stringify(teams, null, 2) + "\n");

console.log(`Regenerated: 9 players x 5 teams (45 pooled, dropped ${DROPPED.join(", ")}).`);
for (const p of PLAYERS) console.log(`  ${p}: ${assignments[p].join(", ")}`);
