import type { ValidationStatus } from "@/lib/jobs-data";
import { cn } from "@/lib/utils";
import { BadgeCheck, AlertTriangle, Building2, HelpCircle } from "lucide-react";

const config: Record<
  ValidationStatus,
  { className: string; Icon: typeof BadgeCheck }
> = {
  Validated: {
    className: "bg-risk-low-soft text-risk-low border-risk-low/20",
    Icon: BadgeCheck,
  },
  "Need Manual Check": {
    className: "bg-risk-medium-soft text-risk-medium border-risk-medium/20",
    Icon: AlertTriangle,
  },
  "Industry Dependent": {
    className: "bg-accent text-accent-foreground border-border",
    Icon: Building2,
  },
  "Low Confidence": {
    className: "bg-risk-high-soft text-risk-high border-risk-high/20",
    Icon: HelpCircle,
  },
};

export function ValidationStatusBadge({ status }: { status: ValidationStatus }) {
  const { className, Icon } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}
