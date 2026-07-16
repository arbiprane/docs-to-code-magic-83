import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { JobImpact } from "@/lib/jobs-data";
import { useJobs, useDeleteJob } from "@/lib/use-jobs";
import { exportJobsToCsv } from "@/lib/export-csv";
import { useAuth } from "@/hooks/use-auth";
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
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { AddJobDialog } from "@/components/AddJobDialog";
import { LoginScreen } from "@/components/LoginScreen";
import { Button } from "@/components/ui/button";

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
          "Interactive dashboard mapping AI exposure, replacement risk, and recommended actions across occupations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <Dashboard userId={user.id} />;
}

function Dashboard({ userId }: { userId: string }) {
  const { data: allJobs = [], isLoading } = useJobs();
  const deleteJob = useDeleteJob();

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selected, setSelected] = useState<JobImpact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(allJobs.map((j) => j.jobCategory))).sort(),
    [allJobs],
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
  }, [allJobs, filters]);

  const hasFilters =
    filters.search !== "" ||
    filters.risk !== "all" ||
    filters.exposure !== "all" ||
    filters.collar !== "all" ||
    filters.category !== "all";

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(50%_70%_at_12%_-10%,var(--color-accent)_0%,transparent_65%)]"
        />
        <div className="relative mx-auto flex max-w-7xl items-start justify-between gap-4 px-4 py-9 sm:px-6 lg:px-8 lg:py-11">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Workforce analytics
            </span>
            <h1 className="mt-2 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              AI job impact tracker
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
              Mapping AI exposure, replacement risk, and recommended actions across
              occupations.
            </p>
          </div>
          <GoogleSignInButton />
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
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportJobsToCsv(filtered)}
            disabled={filtered.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <AddJobDialog />
        </div>
        <JobsDataTable
          data={filtered}
          hasFilters={hasFilters}
          onResetFilters={() => setFilters(emptyFilters)}
          currentUserId={userId}
          onView={(job) => {
            setSelected(job);
            setDrawerOpen(true);
          }}
          onDelete={(job) => {
            deleteJob.mutate(job.id, {
              onSuccess: () => toast.success("Job deleted"),
              onError: () => toast.error("Couldn't delete job. Please try again."),
            });
          }}
        />
        {!isLoading && allJobs.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No jobs in the dataset yet. Add the first one above.
          </p>
        )}
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
