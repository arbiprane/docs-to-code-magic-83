import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import type { JobImpact, RiskLevel } from "@/lib/jobs-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RISK_COLORS: Record<RiskLevel, string> = {
  High: "var(--color-risk-high)",
  Medium: "var(--color-risk-medium)",
  Low: "var(--color-risk-low)",
};

export function DashboardCharts({ jobs }: { jobs: JobImpact[] }) {
  const distribution = useMemo(() => {
    const levels: RiskLevel[] = ["High", "Medium", "Low"];
    return levels.map((level) => ({
      name: level,
      value: jobs.filter((j) => j.replacementRiskLevel === level).length,
    }));
  }, [jobs]);

  const collarData = useMemo(() => {
    const collars = ["White Collar", "Blue Collar"] as const;
    return collars.map((collar) => {
      const rows = jobs.filter((j) => j.collarType === collar);
      return {
        collar,
        High: rows.filter((r) => r.replacementRiskLevel === "High").length,
        Medium: rows.filter((r) => r.replacementRiskLevel === "Medium").length,
        Low: rows.filter((r) => r.replacementRiskLevel === "Low").length,
      };
    });
  }, [jobs]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Risk Distribution</CardTitle>
          <p className="text-xs text-muted-foreground">
            Share of jobs by Replacement Risk Level
          </p>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {distribution.map((entry) => (
                  <Cell key={entry.name} fill={RISK_COLORS[entry.name as RiskLevel]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: "var(--color-muted-foreground)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Collar Type vs Replacement Risk</CardTitle>
          <p className="text-xs text-muted-foreground">
            How risk distributes across White and Blue Collar roles
          </p>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={collarData} barCategoryGap={24}>
              <XAxis
                dataKey="collar"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: "var(--color-muted-foreground)" }}
              />
              <Bar dataKey="High" stackId="a" fill={RISK_COLORS.High} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Medium" stackId="a" fill={RISK_COLORS.Medium} />
              <Bar dataKey="Low" stackId="a" fill={RISK_COLORS.Low} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
