import { cn } from "@/lib/utils";

export function confidenceLabel(score: number) {
  if (score >= 85) return "High";
  if (score >= 70) return "Medium";
  return "Low";
}

export function ConfidenceBadge({ score }: { score: number }) {
  const label = confidenceLabel(score);
  const tone =
    label === "High"
      ? "bg-risk-low-soft text-risk-low border-risk-low/20"
      : label === "Medium"
        ? "bg-risk-medium-soft text-risk-medium border-risk-medium/20"
        : "bg-risk-high-soft text-risk-high border-risk-high/20";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tone,
      )}
    >
      Confidence: {label} · {score}/100
    </span>
  );
}
