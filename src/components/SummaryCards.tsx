import type { JobImpact } from "@/lib/jobs-data";
import { Briefcase, ShieldAlert, ShieldQuestion, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function SummaryCards({ jobs }: { jobs: JobImpact[] }) {
  const total = jobs.length;
  const high = jobs.filter((j) => j.replacementRiskLevel === "High").length;
  const medium = jobs.filter((j) => j.replacementRiskLevel === "Medium").length;
  const low = jobs.filter((j) => j.replacementRiskLevel === "Low").length;

  const items = [
    {
      label: "Total Jobs Tracked",
      value: total,
      Icon: Briefcase,
      iconClass: "bg-accent text-accent-foreground",
      hint: "Occupations in the dataset",
    },
    {
      label: "High Risk",
      value: high,
      Icon: ShieldAlert,
      iconClass: "bg-risk-high-soft text-risk-high",
      hint: `${total ? Math.round((high / total) * 100) : 0}% of tracked jobs`,
    },
    {
      label: "Medium Risk",
      value: medium,
      Icon: ShieldQuestion,
      iconClass: "bg-risk-medium-soft text-risk-medium",
      hint: `${total ? Math.round((medium / total) * 100) : 0}% of tracked jobs`,
    },
    {
      label: "Low Risk",
      value: low,
      Icon: ShieldCheck,
      iconClass: "bg-risk-low-soft text-risk-low",
      hint: `${total ? Math.round((low / total) * 100) : 0}% of tracked jobs`,
    },
  ];

  return (
    <div className="surface grid grid-cols-2 divide-y divide-border/60 rounded-2xl ring-1 ring-black/[0.04] sm:grid-cols-4 sm:divide-y-0 sm:divide-x dark:ring-white/[0.06]">
      {items.map(({ label, value, Icon, iconClass, hint }) => (
        <div key={label} className="flex items-center gap-4 p-5">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              iconClass,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="tabular-nums text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            <p className="truncate text-sm text-foreground/80">{label}</p>
            <p className="truncate text-xs text-muted-foreground">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
