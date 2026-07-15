import type { JobImpact } from "@/lib/jobs-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { RiskBadge } from "./RiskBadge";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { ValidationStatusBadge } from "./ValidationStatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Building2,
  User,
  Zap,
  Shield,
  Sparkles,
  Wrench,
  Target,
  ClipboardCheck,
  BookOpen,
} from "lucide-react";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Briefcase;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export function JobRiskProfileDrawer({
  job,
  open,
  onOpenChange,
}: {
  job: JobImpact | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-xl"
      >
        {job && (
          <>
            <SheetHeader className="space-y-3 border-b bg-muted/30 p-6">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> {job.jobCategory}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {job.collarType}
                </span>
              </div>
              <SheetTitle className="text-2xl leading-tight">
                {job.jobTitle}
              </SheetTitle>
              <SheetDescription className="text-sm">
                Job risk profile — AI exposure and replacement analysis.
              </SheetDescription>
              <div className="flex flex-wrap gap-2 pt-1">
                <RiskBadge level={job.aiExposureLevel} label={`AI Exposure: ${job.aiExposureLevel}`} />
                <RiskBadge
                  level={job.replacementRiskLevel}
                  label={`Replacement: ${job.replacementRiskLevel}`}
                />
                <ConfidenceBadge score={job.confidenceScore} />
                <ValidationStatusBadge status={job.validationStatus} />
              </div>
            </SheetHeader>

            <div className="space-y-6 p-6">
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <span>Analysis Confidence</span>
                  <span>{job.confidenceScore}/100</span>
                </div>
                <Progress value={job.confidenceScore} className="h-2" />
              </div>

              <Section icon={Briefcase} title="Main Tasks">
                {job.mainTasks}
              </Section>

              <Section icon={Zap} title="Why It Matters">
                {job.reason}
              </Section>

              <Section icon={Shield} title="Human Advantage">
                {job.humanRelevantSkills}
              </Section>

              <Section icon={Wrench} title="AI Tools Impact">
                {job.aiToolsImpact}
              </Section>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Target className="h-3.5 w-3.5" />
                  Recommended Action
                </div>
                <p className="mt-1.5 text-sm font-medium text-foreground">
                  {job.recommendedAction}
                </p>
              </div>

              <Section icon={ClipboardCheck} title="Validation Note">
                {job.validationNote}
              </Section>

              <Section icon={BookOpen} title="Source Reference">
                <span className="text-muted-foreground">{job.sourceReference}</span>
              </Section>

              <div className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Analysis based on rule-based scoring. Validate against your industry
                context before acting.
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
