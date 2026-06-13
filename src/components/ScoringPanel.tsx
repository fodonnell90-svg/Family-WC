"use client";

import { Goal, Medal } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SCORING } from "@/lib/scoring";

const RESULT_RULES = [
  { label: "Goal scored (any match)", points: SCORING.goalPoint },
  { label: "Win", points: SCORING.win },
  { label: "Draw", points: SCORING.draw },
];

function RuleList({ rules }: { rules: { label: string; points: number }[] }) {
  return (
    <ul className="flex flex-col">
      {rules.map((r) => (
        <li
          key={r.label}
          className="flex items-center justify-between border-b border-border/50 py-2.5 text-sm last:border-b-0"
        >
          <span className="text-muted-foreground">{r.label}</span>
          <span className="font-display font-bold tabular-nums text-primary">+{r.points}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ScoringPanel() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="animate-rise">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Goal className="size-4 text-primary" />
            Points system
          </CardTitle>
        </CardHeader>
        <CardHeader className="pt-0">
          <CardDescription className="text-xs leading-relaxed">
            Every goal your team scores earns you a point. Win a match and you get 3 points,
            draw and you get 1 point. Simple as that.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RuleList rules={RESULT_RULES} />
        </CardContent>
      </Card>

      <Card className="animate-rise" style={{ animationDelay: "80ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Medal className="size-4 text-primary" />
            The draw
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          24 players, 2 teams each — all 48 World Cup teams assigned across the group.
          The table is live throughout the tournament.
        </CardContent>
      </Card>
    </div>
  );
}
