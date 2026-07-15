import type { RiskLevel } from "@/lib/jobs-data";
import { cn } from "@/lib/utils";

const styles: Record<RiskLevel, string> = {
  High: "bg-risk-high-soft text-risk-high border-risk-high/20",
  Medium: "bg-risk-medium-soft text-risk-medium border-risk-medium/20",
  Low: "bg-risk-low-soft text-risk-low border-risk-low/20",
};

const dot: Record<RiskLevel, string> = {
  High: "bg-risk-high",
  Medium: "bg-risk-medium",
  Low: "bg-risk-low",
};

export function RiskBadge({
  level,
  label,
  className,
}: {
  level: RiskLevel;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[level],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[level])} />
      {label ?? level}
    </span>
  );
}
