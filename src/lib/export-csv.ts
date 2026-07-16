import type { JobImpact } from "@/lib/jobs-data";

const COLUMNS: { key: keyof JobImpact; label: string }[] = [
  { key: "jobTitle", label: "Job Title" },
  { key: "jobCategory", label: "Category" },
  { key: "collarType", label: "Collar" },
  { key: "mainTasks", label: "Main Tasks" },
  { key: "aiExposureLevel", label: "AI Exposure" },
  { key: "replacementRiskLevel", label: "Replacement Risk" },
  { key: "reason", label: "Reason" },
  { key: "humanRelevantSkills", label: "Human-Relevant Skills" },
  { key: "aiToolsImpact", label: "AI Tools Impact" },
  { key: "validationNote", label: "Validation Note" },
  { key: "recommendedAction", label: "Recommended Action" },
  { key: "confidenceScore", label: "Confidence Score" },
  { key: "validationStatus", label: "Validation Status" },
  { key: "sourceReference", label: "Source Reference" },
];

function escapeCsvValue(value: string | number | null | undefined): string {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportJobsToCsv(jobs: JobImpact[], filename = "ai-job-impact-export.csv") {
  const header = COLUMNS.map((c) => escapeCsvValue(c.label)).join(",");
  const rows = jobs.map((job) =>
    COLUMNS.map((c) => escapeCsvValue(job[c.key])).join(","),
  );
  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
