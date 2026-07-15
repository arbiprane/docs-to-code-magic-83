import type { JobImpact } from "@/lib/jobs-data";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ label, value, Icon, iconClass, hint }) => (
        <Card key={label} className="border-border/60 shadow-sm">
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                iconClass,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
