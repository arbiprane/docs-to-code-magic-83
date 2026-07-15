import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { jobs as allJobs, type JobImpact } from "@/lib/jobs-data";
import { SummaryCards } from "@/components/SummaryCards";
import { ExecutiveInsightPanel } from "@/components/ExecutiveInsightPanel";
import { DashboardCharts } from "@/components/DashboardCharts";
import {
  FilterBar,
  emptyFilters,
  type Filters,
} from "@/components/FilterBar";
import { JobsDataTable } from "@/components/JobsDataTable";
import { JobRiskProfileDrawer } from "@/components/JobRiskProfileDrawer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Job Impact Tracker — Workforce Analytics Dashboard" },
      {
        name: "description",
        content:
          "Interactive dashboard mapping AI exposure, replacement risk, and recommended actions across occupations.",
      },
      {
        property: "og:title",
        content: "AI Job Impact Tracker — Workforce Analytics Dashboard",
      },
      {
        property: "og:description",
        content:
          "Explore how AI reshapes work: exposure levels, replacement risk, and recommended actions across 30+ occupations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selected, setSelected] = useState<JobImpact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(allJobs.map((j) => j.jobCategory))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return allJobs.filter((j) => {
      if (
        q &&
        !(
          j.jobTitle.toLowerCase().includes(q) ||
          j.jobCategory.toLowerCase().includes(q) ||
          j.mainTasks.toLowerCase().includes(q)
        )
      )
        return false;
      if (filters.risk !== "all" && j.replacementRiskLevel !== filters.risk)
        return false;
      if (filters.exposure !== "all" && j.aiExposureLevel !== filters.exposure)
        return false;
      if (filters.collar !== "all" && j.collarType !== filters.collar) return false;
      if (filters.category !== "all" && j.jobCategory !== filters.category)
        return false;
      return true;
    });
  }, [filters]);

  const hasFilters =
    filters.search !== "" ||
    filters.risk !== "all" ||
    filters.exposure !== "all" ||
    filters.collar !== "all" ||
    filters.category !== "all";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              AI Job Impact Tracker
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Workforce analytics: AI exposure, replacement risk, and recommended
              actions.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SummaryCards jobs={filtered} />
        <ExecutiveInsightPanel jobs={filtered} />
        <DashboardCharts jobs={filtered} />
        <FilterBar
          filters={filters}
          categories={categories}
          onChange={setFilters}
          onReset={() => setFilters(emptyFilters)}
        />
        <JobsDataTable
          data={filtered}
          hasFilters={hasFilters}
          onResetFilters={() => setFilters(emptyFilters)}
          onView={(job) => {
            setSelected(job);
            setDrawerOpen(true);
          }}
        />
        <footer className="pb-4 pt-2 text-center text-xs text-muted-foreground">
          Rule-based analysis using an ILO/WEF/OECD-inspired taxonomy. Validate
          against your industry context before making workforce decisions.
        </footer>
      </main>

      <JobRiskProfileDrawer
        job={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
