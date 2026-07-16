import { useMemo } from "react";
import type { JobImpact, RiskLevel } from "@/lib/jobs-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Users, Shield } from "lucide-react";

const exposureScore: Record<RiskLevel, number> = { High: 3, Medium: 2, Low: 1 };

export function ExecutiveInsightPanel({ jobs }: { jobs: JobImpact[] }) {
  const insights = useMemo(() => {
    if (jobs.length === 0) {
      return {
        highPct: 0,
        exposedCollar: "—",
        exposedCollarDetail: "No data available",
        vulnerable: "—",
        skills: "—",
      };
    }

    const total = jobs.length;
    const high = jobs.filter((j) => j.replacementRiskLevel === "High").length;
    const highPct = (high / total) * 100;

    const white = jobs.filter((j) => j.collarType === "White Collar");
    const blue = jobs.filter((j) => j.collarType === "Blue Collar");
    const avg = (arr: JobImpact[]) =>
      arr.length
        ? arr.reduce((s, j) => s + exposureScore[j.aiExposureLevel], 0) / arr.length
        : 0;
    const whiteAvg = avg(white);
    const blueAvg = avg(blue);
    const exposedCollar =
      whiteAvg === blueAvg
        ? "Similar across collars"
        : whiteAvg > blueAvg
          ? "White Collar"
          : "Blue Collar";
    const exposedCollarDetail =
      whiteAvg === blueAvg
        ? "Exposure is comparable across White and Blue Collar roles"
        : `${exposedCollar} roles show higher average AI exposure (${Math.max(whiteAvg, blueAvg).toFixed(2)} vs ${Math.min(whiteAvg, blueAvg).toFixed(2)})`;

    const catCount = new Map<string, number>();
    jobs
      .filter((j) => j.replacementRiskLevel === "High")
      .forEach((j) => catCount.set(j.jobCategory, (catCount.get(j.jobCategory) ?? 0) + 1));
    const vulnerable =
      [...catCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([c]) => c)
        .join(", ") || "None identified";

    const skillCount = new Map<string, number>();
    jobs
      .filter((j) => j.replacementRiskLevel === "Low")
      .forEach((j) =>
        j.humanRelevantSkills
          .split(/[,;]/)
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
          .forEach((s) => skillCount.set(s, (skillCount.get(s) ?? 0) + 1)),
      );
    const skills =
      [...skillCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([s]) => s.replace(/\b\w/g, (c) => c.toUpperCase()))
        .join(", ") || "Empathy, judgment, dexterity";

    return { highPct, exposedCollar, exposedCollarDetail, vulnerable, skills };
  }, [jobs]);

  const items = [
    {
      Icon: TrendingUp,
      title: "High-risk exposure",
      body: `${insights.highPct.toFixed(1)}% of tracked jobs fall into the High Replacement Risk band.`,
    },
    {
      Icon: Users,
      title: "Most exposed workforce",
      body: insights.exposedCollarDetail,
    },
    {
      Icon: Shield,
      title: "Most vulnerable categories",
      body: `Categories concentrating the most high-risk roles: ${insights.vulnerable}.`,
    },
    {
      Icon: Sparkles,
      title: "Most resilient human skills",
      body: `Skills recurring across low-risk roles: ${insights.skills}.`,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Executive insights</CardTitle>
        <p className="text-xs text-muted-foreground">
          Auto-generated from the current dataset — refreshes as you filter.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          {items.map(({ Icon, title, body }) => (
            <div key={title} className="flex gap-3 border-l-2 border-primary/25 pl-4">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
