import type { Draw, Match, Team } from "./types";

// ---------------------------------------------------------------------------
// Data is embedded directly to avoid Vercel serverless file-system issues.
// To update results, edit the RESULTS object below and redeploy.
// ---------------------------------------------------------------------------

const DRAW_DATA: Draw = {
  seed: "wc2026-sweepstake-24p-family",
  players: ["Mam","Dad","Francis","Ali","Aisling","Emma","Jordan","Kate","Aoife","Mick","Anne","Sharon","Maureen","Ray","Anna","Ailbhe","Declan","Mary","Michelle","Kev","Mark","Adam","James","Nana"],
  assignments: {
    "Mam":     ["Ecuador","Curaçao"],
    "Dad":     ["Spain","Uzbekistan"],
    "Francis": ["Portugal","Cape Verde"],
    "Ali":     ["Switzerland","Qatar"],
    "Aisling": ["Germany","Ivory Coast"],
    "Emma":    ["Brazil","Sweden"],
    "Jordan":  ["Belgium","Norway"],
    "Kate":    ["Senegal","Jordan"],
    "Aoife":   ["Netherlands","Paraguay"],
    "Mick":    ["Croatia","Canada"],
    "Anne":    ["Colombia","Ghana"],
    "Sharon":  ["South Korea","Czech Republic"],
    "Maureen": ["Iran","Haiti"],
    "Ray":     ["Argentina","New Zealand"],
    "Anna":    ["Japan","Tunisia"],
    "Ailbhe":  ["Uruguay","Algeria"],
    "Declan":  ["Turkey","Iraq"],
    "Mary":    ["Austria","DR Congo"],
    "Michelle":["Morocco","South Africa"],
    "Kev":     ["Australia","Saudi Arabia"],
    "Mark":    ["Mexico","Panama"],
    "Adam":    ["France","Egypt"],
    "James":   ["England","Bosnia-Herzegovina"],
    "Nana":    ["USA","Scotland"],
  }
};

// Knockout results — update this object as matches are played.
// For penalty shootouts: homeScore/awayScore = score after 90/120 mins,
// homePens/awayPens = shootout score (used only to determine winner).
const RESULTS: Record<string, Partial<Match> & { home: string; away: string; homeScore: number; awayScore: number; homePens: number|null; awayPens: number|null; status: Match["status"]; stage: string; round: "group"|"knockout"; date: string }> = {
  "ko_r32_1":  { home:"South Africa", away:"Canada",           homeScore:0, awayScore:1, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-06-28" },
  "ko_r32_2":  { home:"Brazil",       away:"Japan",            homeScore:2, awayScore:1, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-06-29" },
  "ko_r32_3":  { home:"Germany",      away:"Paraguay",         homeScore:1, awayScore:1, homePens:3,    awayPens:4,    status:"FT", stage:"round-32", round:"knockout", date:"2026-06-29" },
  "ko_r32_4":  { home:"Netherlands",  away:"Morocco",          homeScore:1, awayScore:1, homePens:2,    awayPens:3,    status:"FT", stage:"round-32", round:"knockout", date:"2026-06-30" },
  "ko_r32_5":  { home:"Ivory Coast",  away:"Norway",           homeScore:1, awayScore:2, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-06-30" },
  "ko_r32_6":  { home:"France",       away:"Sweden",           homeScore:3, awayScore:0, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-06-30" },
  "ko_r32_7":  { home:"Mexico",       away:"Ecuador",          homeScore:2, awayScore:0, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-01" },
  "ko_r32_8":  { home:"England",      away:"DR Congo",         homeScore:2, awayScore:1, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-01" },
  "ko_r32_9":  { home:"Belgium",      away:"Senegal",          homeScore:3, awayScore:2, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-01" },
  "ko_r32_10": { home:"USA",          away:"Bosnia-Herzegovina",homeScore:2, awayScore:0, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-02" },
  "ko_r32_11": { home:"Spain",        away:"Austria",          homeScore:3, awayScore:0, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-02" },
  "ko_r32_12": { home:"Portugal",     away:"Croatia",          homeScore:2, awayScore:1, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-03" },
  "ko_r32_13": { home:"Switzerland",  away:"Algeria",          homeScore:2, awayScore:0, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-03" },
  "ko_r32_14": { home:"Australia",    away:"Egypt",            homeScore:1, awayScore:1, homePens:2,    awayPens:4,    status:"FT", stage:"round-32", round:"knockout", date:"2026-07-03" },
  "ko_r32_15": { home:"Argentina",    away:"Cape Verde",       homeScore:3, awayScore:2, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-04" },
  "ko_r32_16": { home:"Colombia",     away:"Ghana",            homeScore:1, awayScore:0, homePens:null, awayPens:null, status:"FT", stage:"round-32", round:"knockout", date:"2026-07-04" },
  "ko_r16_1":  { home:"Canada",       away:"Morocco",          homeScore:0, awayScore:3, homePens:null, awayPens:null, status:"FT", stage:"round-16", round:"knockout", date:"2026-07-04" },
  "ko_r16_2":  { home:"Paraguay",     away:"France",           homeScore:0, awayScore:1, homePens:null, awayPens:null, status:"FT", stage:"round-16", round:"knockout", date:"2026-07-04" },
  "ko_r16_3":  { home:"Brazil",       away:"Norway",           homeScore:1, awayScore:2, homePens:null, awayPens:null, status:"FT", stage:"round-16", round:"knockout", date:"2026-07-05" },
};

export function loadDraw(): Draw {
  return DRAW_DATA;
}

export function loadTeams(): Team[] {
  // Teams are loaded from the static JSON file via fetch at build time,
  // but we inline the minimal data needed for scoring here.
  // Full badge/group data comes from the live API merge in standings.ts.
  return TEAMS_DATA;
}

export function loadFixtures(): Match[] {
  return FIXTURES_DATA;
}

export function loadResults(): Record<string, Partial<Match>> {
  return RESULTS as unknown as Record<string, Partial<Match>>;
}

export function loadMatches(): Match[] {
  const fixtures = loadFixtures();
  const overrides = loadResults();
  const byId = new Map<string, Match>(fixtures.map((m) => [m.id, { ...m }]));

  for (const [id, ov] of Object.entries(overrides)) {
    const existing = byId.get(id);
    const o = ov as typeof RESULTS[string];
    if (existing) {
      byId.set(id, {
        ...existing,
        homeScore: o.homeScore ?? existing.homeScore,
        awayScore: o.awayScore ?? existing.awayScore,
        homePens: o.homePens ?? existing.homePens,
        awayPens: o.awayPens ?? existing.awayPens,
        status: o.status ?? existing.status,
        stage: o.stage ?? existing.stage,
      });
    } else if (o.home && o.away && o.stage) {
      byId.set(id, {
        id,
        date: o.date ?? "",
        time: null,
        timestamp: null,
        group: null,
        round: o.round ?? "knockout",
        stage: o.stage,
        home: o.home,
        away: o.away,
        homeBadge: null,
        awayBadge: null,
        venue: null,
        city: null,
        homeScore: o.homeScore ?? null,
        awayScore: o.awayScore ?? null,
        homePens: o.homePens ?? null,
        awayPens: o.awayPens ?? null,
        status: o.status ?? "NS",
      });
    }
  }

  return Array.from(byId.values()).sort((a, b) =>
    (a.timestamp ?? a.date ?? "").localeCompare(b.timestamp ?? b.date ?? ""),
  );
}

export interface ResultOverride {
  homeScore?: number | null;
  awayScore?: number | null;
  homePens?: number | null;
  awayPens?: number | null;
  status?: Match["status"];
  stage?: string;
  home?: string;
  away?: string;
  group?: string | null;
  round?: Match["round"];
  date?: string;
  homeBadge?: string | null;
  awayBadge?: string | null;
}

// ---------------------------------------------------------------------------
// Embedded teams data
// ---------------------------------------------------------------------------
const TEAMS_DATA: Team[] = [
  {name:"Mexico",group:"A",badge:"https://r2.thesportsdb.com/images/media/team/badge/3rmosi1748525208.png",tier:2},
  {name:"South Africa",group:"A",badge:"https://r2.thesportsdb.com/images/media/team/badge/xjz9j91553368824.png",tier:5},
  {name:"South Korea",group:"A",badge:"https://r2.thesportsdb.com/images/media/team/badge/a8nqfs1589564916.png",tier:3},
  {name:"Czech Republic",group:"A",badge:"https://r2.thesportsdb.com/images/media/team/badge/1o0cx31654205806.png",tier:4},
  {name:"Canada",group:"B",badge:"https://r2.thesportsdb.com/images/media/team/badge/2t631f1595154867.png",tier:3},
  {name:"Bosnia-Herzegovina",group:"B",badge:"https://r2.thesportsdb.com/images/media/team/badge/wtqqst1455463120.png",tier:5},
  {name:"Qatar",group:"B",badge:"https://r2.thesportsdb.com/images/media/team/badge/rs3ir31642708685.png",tier:5},
  {name:"Switzerland",group:"B",badge:"https://r2.thesportsdb.com/images/media/team/badge/mb7yqe1717365808.png",tier:2},
  {name:"Brazil",group:"C",badge:"https://r2.thesportsdb.com/images/media/team/badge/jl6dip1726167280.png",tier:1},
  {name:"Morocco",group:"C",badge:"https://r2.thesportsdb.com/images/media/team/badge/hbmwkj1731791275.png",tier:1},
  {name:"Haiti",group:"C",badge:"https://r2.thesportsdb.com/images/media/team/badge/gml8wx1598135302.png",tier:0},
  {name:"Scotland",group:"C",badge:"https://r2.thesportsdb.com/images/media/team/badge/3691i11552945146.png",tier:4},
  {name:"USA",group:"D",badge:"https://r2.thesportsdb.com/images/media/team/badge/21f0oi1597948195.png",tier:2},
  {name:"Paraguay",group:"D",badge:"https://r2.thesportsdb.com/images/media/team/badge/khgav41553419195.png",tier:4},
  {name:"Australia",group:"D",badge:"https://r2.thesportsdb.com/images/media/team/badge/lark6k1661780848.png",tier:3},
  {name:"Turkey",group:"D",badge:"https://r2.thesportsdb.com/images/media/team/badge/70c4oo1591982459.png",tier:3},
  {name:"Germany",group:"E",badge:"https://r2.thesportsdb.com/images/media/team/badge/1xysi51726167152.png",tier:2},
  {name:"Curaçao",group:"E",badge:"https://r2.thesportsdb.com/images/media/team/badge/itygvb1600955363.png",tier:0},
  {name:"Ivory Coast",group:"E",badge:"https://r2.thesportsdb.com/images/media/team/badge/rwxuuu1455465643.png",tier:4},
  {name:"Ecuador",group:"E",badge:"https://r2.thesportsdb.com/images/media/team/badge/47wv2y1591989301.png",tier:3},
  {name:"Netherlands",group:"F",badge:"https://r2.thesportsdb.com/images/media/team/badge/1p0hr41593787110.png",tier:1},
  {name:"Japan",group:"F",badge:"https://r2.thesportsdb.com/images/media/team/badge/ffsyxz1591989843.png",tier:2},
  {name:"Sweden",group:"F",badge:"https://r2.thesportsdb.com/images/media/team/badge/h5adzg1591981772.png",tier:4},
  {name:"Tunisia",group:"F",badge:"https://r2.thesportsdb.com/images/media/team/badge/7r89rg1526727277.png",tier:4},
  {name:"Belgium",group:"G",badge:"https://r2.thesportsdb.com/images/media/team/badge/8xlvxv1592062265.png",tier:1},
  {name:"Egypt",group:"G",badge:"https://r2.thesportsdb.com/images/media/team/badge/uheyzo1742102234.png",tier:3},
  {name:"Iran",group:"G",badge:"https://r2.thesportsdb.com/images/media/team/badge/uttpvw1455465617.png",tier:3},
  {name:"New Zealand",group:"G",badge:"https://r2.thesportsdb.com/images/media/team/badge/91xpk81742982935.png",tier:0},
  {name:"Saudi Arabia",group:"H",badge:"https://r2.thesportsdb.com/images/media/team/badge/24xwpq1594125742.png",tier:5},
  {name:"Uruguay",group:"H",badge:"https://r2.thesportsdb.com/images/media/team/badge/6vjbr11726167756.png",tier:2},
  {name:"Spain",group:"H",badge:"https://r2.thesportsdb.com/images/media/team/badge/ncgqyr1726166942.png",tier:1},
  {name:"Cape Verde",group:"H",badge:"https://r2.thesportsdb.com/images/media/team/badge/5jn0o71593280376.png",tier:5},
  {name:"France",group:"I",badge:"https://r2.thesportsdb.com/images/media/team/badge/p3n0z51726166851.png",tier:1},
  {name:"Senegal",group:"I",badge:"https://www.thesportsdb.com/images/media/team/badge/slayb01780546342.png",tier:2},
  {name:"Iraq",group:"I",badge:"https://r2.thesportsdb.com/images/media/team/badge/aqidfn1742100110.png",tier:5},
  {name:"Norway",group:"I",badge:"https://r2.thesportsdb.com/images/media/team/badge/gyfn811591973155.png",tier:4},
  {name:"Argentina",group:"J",badge:"https://r2.thesportsdb.com/images/media/team/badge/3zplhu1726167477.png",tier:1},
  {name:"Algeria",group:"J",badge:"https://r2.thesportsdb.com/images/media/team/badge/rrwpry1455460218.png",tier:3},
  {name:"Austria",group:"J",badge:"https://r2.thesportsdb.com/images/media/team/badge/874p631628721400.png",tier:3},
  {name:"Jordan",group:"J",badge:"https://r2.thesportsdb.com/images/media/team/badge/59fo2s1742100034.png",tier:5},
  {name:"England",group:"L",badge:"https://r2.thesportsdb.com/images/media/team/badge/vf5ttc1726166739.png",tier:1},
  {name:"Croatia",group:"L",badge:"https://r2.thesportsdb.com/images/media/team/badge/vvtsyu1455465317.png",tier:2},
  {name:"Ghana",group:"L",badge:"https://r2.thesportsdb.com/images/media/team/badge/j589xw1751526124.png",tier:5},
  {name:"Panama",group:"L",badge:"https://r2.thesportsdb.com/images/media/team/badge/asp2ck1715849700.png",tier:4},
  {name:"Portugal",group:"K",badge:"https://r2.thesportsdb.com/images/media/team/badge/swqvpy1455466083.png",tier:1},
  {name:"DR Congo",group:"K",badge:"https://r2.thesportsdb.com/images/media/team/badge/s85jjw1728749022.png",tier:4},
  {name:"Uzbekistan",group:"K",badge:"https://r2.thesportsdb.com/images/media/team/badge/u5bgze1597943605.png",tier:5},
  {name:"Colombia",group:"K",badge:"https://r2.thesportsdb.com/images/media/team/badge/4ymyku1691180081.png",tier:2},
];

// ---------------------------------------------------------------------------
// Embedded fixtures data (group stage only — knockout fixtures come via RESULTS)
// ---------------------------------------------------------------------------
const FIXTURES_DATA: Match[] = [
  {id:"2391728",date:"2026-06-11",time:"19:00:00",timestamp:"2026-06-11T19:00:00",group:"A",round:"group",stage:"group-1",home:"Mexico",away:"South Africa",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/3rmosi1748525208.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/xjz9j91553368824.png",venue:"Estadio Azteca",city:"Mexico City, MX",homeScore:2,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2461103",date:"2026-06-12",time:"02:00:00",timestamp:"2026-06-12T02:00:00",group:"A",round:"group",stage:"group-1",home:"South Korea",away:"Czech Republic",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/a8nqfs1589564916.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/1o0cx31654205806.png",venue:"Estadio Akron",city:"Zapopan, JA",homeScore:2,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2461104",date:"2026-06-12",time:"19:00:00",timestamp:"2026-06-12T19:00:00",group:"B",round:"group",stage:"group-1",home:"Canada",away:"Bosnia-Herzegovina",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/2t631f1595154867.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/wtqqst1455463120.png",venue:"BMO Field",city:"Toronto, ON",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391729",date:"2026-06-13",time:"01:00:00",timestamp:"2026-06-13T01:00:00",group:"D",round:"group",stage:"group-1",home:"USA",away:"Paraguay",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/21f0oi1597948195.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/khgav41553419195.png",venue:"SoFi Stadium",city:"Inglewood, CA",homeScore:4,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391732",date:"2026-06-13",time:"19:00:00",timestamp:"2026-06-13T19:00:00",group:"B",round:"group",stage:"group-1",home:"Qatar",away:"Switzerland",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/rs3ir31642708685.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/mb7yqe1717365808.png",venue:"Levi's Stadium",city:"Santa Clara, CA",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391730",date:"2026-06-13",time:"22:00:00",timestamp:"2026-06-13T22:00:00",group:"C",round:"group",stage:"group-1",home:"Brazil",away:"Morocco",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/jl6dip1726167280.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/hbmwkj1731791275.png",venue:"MetLife Stadium",city:"East Rutherford, NJ",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391731",date:"2026-06-14",time:"01:00:00",timestamp:"2026-06-14T01:00:00",group:"C",round:"group",stage:"group-1",home:"Haiti",away:"Scotland",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/gml8wx1598135302.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/3691i11552945146.png",venue:"Gillette Stadium",city:"Foxborough, MA",homeScore:0,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2461105",date:"2026-06-14",time:"04:00:00",timestamp:"2026-06-14T04:00:00",group:"D",round:"group",stage:"group-1",home:"Australia",away:"Turkey",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/lark6k1661780848.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/70c4oo1591982459.png",venue:"BC Place",city:"Vancouver, BC",homeScore:2,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391733",date:"2026-06-14",time:"17:00:00",timestamp:"2026-06-14T17:00:00",group:"E",round:"group",stage:"group-1",home:"Germany",away:"Curaçao",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/1xysi51726167152.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/itygvb1600955363.png",venue:"Reliant Stadium",city:"Houston, TX",homeScore:7,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391735",date:"2026-06-14",time:"20:00:00",timestamp:"2026-06-14T20:00:00",group:"F",round:"group",stage:"group-1",home:"Netherlands",away:"Japan",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/1p0hr41593787110.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/ffsyxz1591989843.png",venue:"AT&T Stadium",city:"Arlington, TX",homeScore:2,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391734",date:"2026-06-14",time:"23:00:00",timestamp:"2026-06-14T23:00:00",group:"E",round:"group",stage:"group-1",home:"Ivory Coast",away:"Ecuador",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/rwxuuu1455465643.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/47wv2y1591989301.png",venue:"Lincoln Financial Field",city:"Philadelphia, PA",homeScore:1,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2461106",date:"2026-06-15",time:"02:00:00",timestamp:"2026-06-15T02:00:00",group:"F",round:"group",stage:"group-1",home:"Sweden",away:"Tunisia",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/h5adzg1591981772.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/7r89rg1526727277.png",venue:"Estadio BBVA",city:"Guadalupe, NL",homeScore:5,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391739",date:"2026-06-15",time:"16:00:00",timestamp:"2026-06-15T16:00:00",group:"H",round:"group",stage:"group-1",home:"Spain",away:"Cape Verde",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/ncgqyr1726166942.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/5jn0o71593280376.png",venue:"Mercedes-Benz Stadium",city:"Atlanta, GA",homeScore:0,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391736",date:"2026-06-15",time:"19:00:00",timestamp:"2026-06-15T19:00:00",group:"G",round:"group",stage:"group-1",home:"Belgium",away:"Egypt",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/8xlvxv1592062265.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/uheyzo1742102234.png",venue:"Lumen Field",city:"Seattle, WA",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391738",date:"2026-06-15",time:"22:00:00",timestamp:"2026-06-15T22:00:00",group:"H",round:"group",stage:"group-1",home:"Saudi Arabia",away:"Uruguay",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/24xwpq1594125742.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/6vjbr11726167756.png",venue:"Hard Rock Stadium",city:"Miami Gardens, FL",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391737",date:"2026-06-16",time:"01:00:00",timestamp:"2026-06-16T01:00:00",group:"G",round:"group",stage:"group-1",home:"Iran",away:"New Zealand",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/uttpvw1455465617.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/91xpk81742982935.png",venue:"SoFi Stadium",city:"Inglewood, CA",homeScore:2,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391742",date:"2026-06-16",time:"19:00:00",timestamp:"2026-06-16T19:00:00",group:"I",round:"group",stage:"group-1",home:"France",away:"Senegal",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/p3n0z51726166851.png",awayBadge:"https://www.thesportsdb.com/images/media/team/badge/slayb01780546342.png",venue:"MetLife Stadium",city:"East Rutherford, NJ",homeScore:3,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2461107",date:"2026-06-16",time:"22:00:00",timestamp:"2026-06-16T22:00:00",group:"I",round:"group",stage:"group-1",home:"Iraq",away:"Norway",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/aqidfn1742100110.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/gyfn811591973155.png",venue:"Gillette Stadium",city:"Foxborough, MA",homeScore:1,awayScore:4,homePens:null,awayPens:null,status:"FT"},
  {id:"2391740",date:"2026-06-17",time:"01:00:00",timestamp:"2026-06-17T01:00:00",group:"J",round:"group",stage:"group-1",home:"Argentina",away:"Algeria",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/3zplhu1726167477.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/rrwpry1455460218.png",venue:"GEHA Field at Arrowhead Stadium",city:"Kansas City, MO",homeScore:3,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391741",date:"2026-06-17",time:"04:00:00",timestamp:"2026-06-17T04:00:00",group:"J",round:"group",stage:"group-1",home:"Austria",away:"Jordan",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/874p631628721400.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/59fo2s1742100034.png",venue:"Levi's Stadium",city:"Santa Clara, CA",homeScore:3,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2461108",date:"2026-06-17",time:"17:00:00",timestamp:"2026-06-17T17:00:00",group:"K",round:"group",stage:"group-1",home:"Portugal",away:"DR Congo",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/swqvpy1455466083.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/s85jjw1728749022.png",venue:"Reliant Stadium",city:"Houston, TX",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391743",date:"2026-06-17",time:"20:00:00",timestamp:"2026-06-17T20:00:00",group:"L",round:"group",stage:"group-1",home:"England",away:"Croatia",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/vf5ttc1726166739.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/vvtsyu1455465317.png",venue:"AT&T Stadium",city:"Arlington, TX",homeScore:4,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391744",date:"2026-06-17",time:"23:00:00",timestamp:"2026-06-17T23:00:00",group:"L",round:"group",stage:"group-1",home:"Ghana",away:"Panama",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/j589xw1751526124.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/asp2ck1715849700.png",venue:"BMO Field",city:"Toronto, ON",homeScore:1,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391745",date:"2026-06-18",time:"02:00:00",timestamp:"2026-06-18T02:00:00",group:"K",round:"group",stage:"group-1",home:"Uzbekistan",away:"Colombia",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/u5bgze1597943605.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/4ymyku1691180081.png",venue:"Estadio Azteca",city:"Mexico City, MX",homeScore:1,awayScore:3,homePens:null,awayPens:null,status:"FT"},
  {id:"2461109",date:"2026-06-18",time:"16:00:00",timestamp:"2026-06-18T16:00:00",group:"A",round:"group",stage:"group-2",home:"Czech Republic",away:"South Africa",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/1o0cx31654205806.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/xjz9j91553368824.png",venue:"Mercedes-Benz Stadium",city:"Atlanta, GA",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2461110",date:"2026-06-18",time:"19:00:00",timestamp:"2026-06-18T19:00:00",group:"B",round:"group",stage:"group-2",home:"Switzerland",away:"Bosnia-Herzegovina",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/mb7yqe1717365808.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/wtqqst1455463120.png",venue:"SoFi Stadium",city:"Inglewood, CA",homeScore:4,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391746",date:"2026-06-18",time:"22:00:00",timestamp:"2026-06-18T22:00:00",group:"B",round:"group",stage:"group-2",home:"Canada",away:"Qatar",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/2t631f1595154867.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/rs3ir31642708685.png",venue:"BC Place",city:"Vancouver, BC",homeScore:6,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391747",date:"2026-06-19",time:"01:00:00",timestamp:"2026-06-19T01:00:00",group:"A",round:"group",stage:"group-2",home:"Mexico",away:"South Korea",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/3rmosi1748525208.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/a8nqfs1589564916.png",venue:"Estadio Akron",city:"Zapopan, JA",homeScore:1,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391750",date:"2026-06-19",time:"19:00:00",timestamp:"2026-06-19T19:00:00",group:"D",round:"group",stage:"group-2",home:"USA",away:"Australia",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/21f0oi1597948195.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/lark6k1661780848.png",venue:"Lumen Field",city:"Seattle, WA",homeScore:2,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391749",date:"2026-06-19",time:"22:00:00",timestamp:"2026-06-19T22:00:00",group:"C",round:"group",stage:"group-2",home:"Scotland",away:"Morocco",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/3691i11552945146.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/hbmwkj1731791275.png",venue:"Gillette Stadium",city:"Foxborough, MA",homeScore:0,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391748",date:"2026-06-20",time:"00:30:00",timestamp:"2026-06-20T00:30:00",group:"C",round:"group",stage:"group-2",home:"Brazil",away:"Haiti",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/jl6dip1726167280.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/gml8wx1598135302.png",venue:"Lincoln Financial Field",city:"Philadelphia, PA",homeScore:3,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2461111",date:"2026-06-20",time:"03:00:00",timestamp:"2026-06-20T03:00:00",group:"D",round:"group",stage:"group-2",home:"Turkey",away:"Paraguay",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/70c4oo1591982459.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/khgav41553419195.png",venue:"Levi's Stadium",city:"Santa Clara, CA",homeScore:0,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2461112",date:"2026-06-20",time:"17:00:00",timestamp:"2026-06-20T17:00:00",group:"F",round:"group",stage:"group-2",home:"Netherlands",away:"Sweden",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/1p0hr41593787110.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/h5adzg1591981772.png",venue:"Reliant Stadium",city:"Houston, TX",homeScore:5,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391752",date:"2026-06-20",time:"20:00:00",timestamp:"2026-06-20T20:00:00",group:"E",round:"group",stage:"group-2",home:"Germany",away:"Ivory Coast",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/1xysi51726167152.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/rwxuuu1455465643.png",venue:"BMO Field",city:"Toronto, ON",homeScore:2,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391751",date:"2026-06-21",time:"00:00:00",timestamp:"2026-06-21T00:00:00",group:"E",round:"group",stage:"group-2",home:"Ecuador",away:"Curaçao",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/47wv2y1591989301.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/itygvb1600955363.png",venue:"GEHA Field at Arrowhead Stadium",city:"Kansas City, MO",homeScore:0,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391753",date:"2026-06-21",time:"04:00:00",timestamp:"2026-06-21T04:00:00",group:"F",round:"group",stage:"group-2",home:"Tunisia",away:"Japan",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/7r89rg1526727277.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/ffsyxz1591989843.png",venue:"Estadio BBVA",city:"Guadalupe, NL",homeScore:0,awayScore:4,homePens:null,awayPens:null,status:"FT"},
  {id:"2391756",date:"2026-06-21",time:"16:00:00",timestamp:"2026-06-21T16:00:00",group:"H",round:"group",stage:"group-2",home:"Spain",away:"Saudi Arabia",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/ncgqyr1726166942.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/24xwpq1594125742.png",venue:"Mercedes-Benz Stadium",city:"Atlanta, GA",homeScore:4,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391754",date:"2026-06-21",time:"19:00:00",timestamp:"2026-06-21T19:00:00",group:"G",round:"group",stage:"group-2",home:"Belgium",away:"Iran",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/8xlvxv1592062265.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/uttpvw1455465617.png",venue:"SoFi Stadium",city:"Inglewood, CA",homeScore:0,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391757",date:"2026-06-21",time:"22:00:00",timestamp:"2026-06-21T22:00:00",group:"H",round:"group",stage:"group-2",home:"Uruguay",away:"Cape Verde",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/6vjbr11726167756.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/5jn0o71593280376.png",venue:"Hard Rock Stadium",city:"Miami Gardens, FL",homeScore:2,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391755",date:"2026-06-22",time:"01:00:00",timestamp:"2026-06-22T01:00:00",group:"G",round:"group",stage:"group-2",home:"New Zealand",away:"Egypt",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/91xpk81742982935.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/uheyzo1742102234.png",venue:"BC Place",city:"Vancouver, BC",homeScore:1,awayScore:3,homePens:null,awayPens:null,status:"FT"},
  {id:"2391758",date:"2026-06-22",time:"17:00:00",timestamp:"2026-06-22T17:00:00",group:"J",round:"group",stage:"group-2",home:"Argentina",away:"Austria",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/3zplhu1726167477.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/874p631628721400.png",venue:"AT&T Stadium",city:"Arlington, TX",homeScore:2,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2461113",date:"2026-06-22",time:"21:00:00",timestamp:"2026-06-22T21:00:00",group:"I",round:"group",stage:"group-2",home:"France",away:"Iraq",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/p3n0z51726166851.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/aqidfn1742100110.png",venue:"Lincoln Financial Field",city:"Philadelphia, PA",homeScore:3,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391760",date:"2026-06-23",time:"00:00:00",timestamp:"2026-06-23T00:00:00",group:"I",round:"group",stage:"group-2",home:"Norway",away:"Senegal",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/gyfn811591973155.png",awayBadge:"https://www.thesportsdb.com/images/media/team/badge/slayb01780546342.png",venue:"MetLife Stadium",city:"East Rutherford, NJ",homeScore:3,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391759",date:"2026-06-23",time:"03:00:00",timestamp:"2026-06-23T03:00:00",group:"J",round:"group",stage:"group-2",home:"Jordan",away:"Algeria",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/59fo2s1742100034.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/rrwpry1455460218.png",venue:"Levi's Stadium",city:"Santa Clara, CA",homeScore:1,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391763",date:"2026-06-23",time:"17:00:00",timestamp:"2026-06-23T17:00:00",group:"K",round:"group",stage:"group-2",home:"Portugal",away:"Uzbekistan",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/swqvpy1455466083.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/u5bgze1597943605.png",venue:"Reliant Stadium",city:"Houston, TX",homeScore:5,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391761",date:"2026-06-23",time:"20:00:00",timestamp:"2026-06-23T20:00:00",group:"L",round:"group",stage:"group-2",home:"England",away:"Ghana",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/vf5ttc1726166739.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/j589xw1751526124.png",venue:"Gillette Stadium",city:"Foxborough, MA",homeScore:0,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391762",date:"2026-06-23",time:"23:00:00",timestamp:"2026-06-23T23:00:00",group:"L",round:"group",stage:"group-2",home:"Panama",away:"Croatia",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/asp2ck1715849700.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/vvtsyu1455465317.png",venue:"BMO Field",city:"Toronto, ON",homeScore:0,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2461114",date:"2026-06-24",time:"02:00:00",timestamp:"2026-06-24T02:00:00",group:"K",round:"group",stage:"group-2",home:"Colombia",away:"DR Congo",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/4ymyku1691180081.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/s85jjw1728749022.png",venue:"Estadio Akron",city:"Zapopan, JA",homeScore:1,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391767",date:"2026-06-24",time:"19:00:00",timestamp:"2026-06-24T19:00:00",group:"B",round:"group",stage:"group-3",home:"Switzerland",away:"Canada",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/mb7yqe1717365808.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/2t631f1595154867.png",venue:"BC Place",city:"Vancouver, BC",homeScore:2,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2461115",date:"2026-06-24",time:"19:00:00",timestamp:"2026-06-24T19:00:00",group:"B",round:"group",stage:"group-3",home:"Bosnia-Herzegovina",away:"Qatar",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/wtqqst1455463120.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/rs3ir31642708685.png",venue:"Lumen Field",city:"Seattle, WA",homeScore:3,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391764",date:"2026-06-24",time:"22:00:00",timestamp:"2026-06-24T22:00:00",group:"C",round:"group",stage:"group-3",home:"Morocco",away:"Haiti",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/hbmwkj1731791275.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/gml8wx1598135302.png",venue:"Mercedes-Benz Stadium",city:"Atlanta, GA",homeScore:4,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391765",date:"2026-06-24",time:"22:00:00",timestamp:"2026-06-24T22:00:00",group:"C",round:"group",stage:"group-3",home:"Scotland",away:"Brazil",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/3691i11552945146.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/jl6dip1726167280.png",venue:"Hard Rock Stadium",city:"Miami Gardens, FL",homeScore:0,awayScore:3,homePens:null,awayPens:null,status:"FT"},
  {id:"2391766",date:"2026-06-25",time:"01:00:00",timestamp:"2026-06-25T01:00:00",group:"A",round:"group",stage:"group-3",home:"South Africa",away:"South Korea",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/xjz9j91553368824.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/a8nqfs1589564916.png",venue:"Estadio BBVA",city:"Guadalupe, NL",homeScore:1,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2461116",date:"2026-06-25",time:"01:00:00",timestamp:"2026-06-25T01:00:00",group:"A",round:"group",stage:"group-3",home:"Czech Republic",away:"Mexico",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/1o0cx31654205806.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/3rmosi1748525208.png",venue:"Estadio Azteca",city:"Mexico City, MX",homeScore:0,awayScore:3,homePens:null,awayPens:null,status:"FT"},
  {id:"2391768",date:"2026-06-25",time:"20:00:00",timestamp:"2026-06-25T20:00:00",group:"E",round:"group",stage:"group-3",home:"Curaçao",away:"Ivory Coast",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/itygvb1600955363.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/rwxuuu1455465643.png",venue:"Lincoln Financial Field",city:"Philadelphia, PA",homeScore:0,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391769",date:"2026-06-25",time:"20:00:00",timestamp:"2026-06-25T20:00:00",group:"E",round:"group",stage:"group-3",home:"Ecuador",away:"Germany",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/47wv2y1591989301.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/1xysi51726167152.png",venue:"MetLife Stadium",city:"East Rutherford, NJ",homeScore:2,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391771",date:"2026-06-25",time:"23:00:00",timestamp:"2026-06-25T23:00:00",group:"F",round:"group",stage:"group-3",home:"Tunisia",away:"Netherlands",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/7r89rg1526727277.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/1p0hr41593787110.png",venue:"GEHA Field at Arrowhead Stadium",city:"Kansas City, MO",homeScore:1,awayScore:3,homePens:null,awayPens:null,status:"FT"},
  {id:"2461117",date:"2026-06-25",time:"23:00:00",timestamp:"2026-06-25T23:00:00",group:"F",round:"group",stage:"group-3",home:"Japan",away:"Sweden",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/ffsyxz1591989843.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/h5adzg1591981772.png",venue:"AT&T Stadium",city:"Arlington, TX",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391770",date:"2026-06-26",time:"02:00:00",timestamp:"2026-06-26T02:00:00",group:"D",round:"group",stage:"group-3",home:"Paraguay",away:"Australia",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/khgav41553419195.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/lark6k1661780848.png",venue:"Levi's Stadium",city:"Santa Clara, CA",homeScore:0,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2461118",date:"2026-06-26",time:"02:00:00",timestamp:"2026-06-26T02:00:00",group:"D",round:"group",stage:"group-3",home:"Turkey",away:"USA",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/70c4oo1591982459.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/21f0oi1597948195.png",venue:"SoFi Stadium",city:"Inglewood, CA",homeScore:3,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391775",date:"2026-06-26",time:"19:00:00",timestamp:"2026-06-26T19:00:00",group:"I",round:"group",stage:"group-3",home:"Norway",away:"France",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/gyfn811591973155.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/p3n0z51726166851.png",venue:"Gillette Stadium",city:"Foxborough, MA",homeScore:1,awayScore:4,homePens:null,awayPens:null,status:"FT"},
  {id:"2461119",date:"2026-06-26",time:"19:00:00",timestamp:"2026-06-26T19:00:00",group:"I",round:"group",stage:"group-3",home:"Senegal",away:"Iraq",homeBadge:"https://www.thesportsdb.com/images/media/team/badge/slayb01780546342.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/aqidfn1742100110.png",venue:"BMO Field",city:"Toronto, ON",homeScore:5,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391772",date:"2026-06-27",time:"00:00:00",timestamp:"2026-06-27T00:00:00",group:"H",round:"group",stage:"group-3",home:"Cape Verde",away:"Saudi Arabia",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/5jn0o71593280376.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/24xwpq1594125742.png",venue:"Reliant Stadium",city:"Houston, TX",homeScore:0,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2391776",date:"2026-06-27",time:"00:00:00",timestamp:"2026-06-27T00:00:00",group:"H",round:"group",stage:"group-3",home:"Uruguay",away:"Spain",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/6vjbr11726167756.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/ncgqyr1726166942.png",venue:"Estadio Akron",city:"Zapopan, JA",homeScore:0,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391773",date:"2026-06-27",time:"03:00:00",timestamp:"2026-06-27T03:00:00",group:"G",round:"group",stage:"group-3",home:"Egypt",away:"Iran",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/uheyzo1742102234.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/uttpvw1455465617.png",venue:"Lumen Field",city:"Seattle, WA",homeScore:1,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391774",date:"2026-06-27",time:"03:00:00",timestamp:"2026-06-27T03:00:00",group:"G",round:"group",stage:"group-3",home:"New Zealand",away:"Belgium",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/91xpk81742982935.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/8xlvxv1592062265.png",venue:"BC Place",city:"Vancouver, BC",homeScore:1,awayScore:5,homePens:null,awayPens:null,status:"FT"},
  {id:"2391779",date:"2026-06-27",time:"21:00:00",timestamp:"2026-06-27T21:00:00",group:"L",round:"group",stage:"group-3",home:"Croatia",away:"Ghana",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/vvtsyu1455465317.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/j589xw1751526124.png",venue:"Lincoln Financial Field",city:"Philadelphia, PA",homeScore:2,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391781",date:"2026-06-27",time:"21:00:00",timestamp:"2026-06-27T21:00:00",group:"L",round:"group",stage:"group-3",home:"Panama",away:"England",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/asp2ck1715849700.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/vf5ttc1726166739.png",venue:"MetLife Stadium",city:"East Rutherford, NJ",homeScore:0,awayScore:2,homePens:null,awayPens:null,status:"FT"},
  {id:"2391778",date:"2026-06-27",time:"23:30:00",timestamp:"2026-06-27T23:30:00",group:"K",round:"group",stage:"group-3",home:"Colombia",away:"Portugal",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/4ymyku1691180081.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/swqvpy1455466083.png",venue:"Hard Rock Stadium",city:"Miami Gardens, FL",homeScore:0,awayScore:0,homePens:null,awayPens:null,status:"FT"},
  {id:"2461120",date:"2026-06-27",time:"23:30:00",timestamp:"2026-06-27T23:30:00",group:"K",round:"group",stage:"group-3",home:"DR Congo",away:"Uzbekistan",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/s85jjw1728749022.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/u5bgze1597943605.png",venue:"Mercedes-Benz Stadium",city:"Atlanta, GA",homeScore:3,awayScore:1,homePens:null,awayPens:null,status:"FT"},
  {id:"2391777",date:"2026-06-28",time:"02:00:00",timestamp:"2026-06-28T02:00:00",group:"J",round:"group",stage:"group-3",home:"Algeria",away:"Austria",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/rrwpry1455460218.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/874p631628721400.png",venue:"GEHA Field at Arrowhead Stadium",city:"Kansas City, MO",homeScore:3,awayScore:3,homePens:null,awayPens:null,status:"FT"},
  {id:"2391780",date:"2026-06-28",time:"02:00:00",timestamp:"2026-06-28T02:00:00",group:"J",round:"group",stage:"group-3",home:"Jordan",away:"Argentina",homeBadge:"https://r2.thesportsdb.com/images/media/team/badge/59fo2s1742100034.png",awayBadge:"https://r2.thesportsdb.com/images/media/team/badge/3zplhu1726167477.png",venue:"AT&T Stadium",city:"Arlington, TX",homeScore:1,awayScore:3,homePens:null,awayPens:null,status:"FT"},
];
