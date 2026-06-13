"use client";

import { MatchSection } from "@/components/MatchesPanel";
import type { Match } from "@/lib/types";

export default function ResultsPanel({
  matches,
  owners,
}: {
  matches: Match[];
  owners: Record<string, string>;
}) {
  const results = matches
    .filter((m) => m.status === "FT")
    .sort((a, b) =>
      (b.timestamp ?? b.date ?? "").localeCompare(a.timestamp ?? a.date ?? "")
    );

  if (results.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No finished matches yet.
      </p>
    );
  }

  return <MatchSection title="Results" matches={results} owners={owners} />;
}
