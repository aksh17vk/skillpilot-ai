import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { ScoreGauge, ProgressBar } from "@/components/app/metrics";

export const trendData = [
  { m: "Jan", v: 42 },
  { m: "Feb", v: 51 },
  { m: "Mar", v: 49 },
  { m: "Apr", v: 63 },
  { m: "May", v: 72 },
  { m: "Jun", v: 78 },
  { m: "Jul", v: 88 },
];

export const radarData = [
  { skill: "Frontend", v: 88 },
  { skill: "Backend", v: 72 },
  { skill: "DevOps", v: 46 },
  { skill: "Data", v: 61 },
  { skill: "System Design", v: 54 },
  { skill: "Testing", v: 69 },
];

export const pieData = [
  { name: "Matched", v: 78, fill: "var(--color-chart-1)" },
  { name: "Partial", v: 12, fill: "var(--color-chart-3)" },
  { name: "Missing", v: 10, fill: "var(--color-chart-5)" },
];

export const barData = [
  { d: "Mon", v: 3 },
  { d: "Tue", v: 5 },
  { d: "Wed", v: 2 },
  { d: "Thu", v: 6 },
  { d: "Fri", v: 4 },
  { d: "Sat", v: 7 },
  { d: "Sun", v: 3 },
];

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "12px",
  color: "var(--color-popover-foreground)",
  fontSize: "12px",
};

export function TrendChart({ height = 90 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={trendData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="m" hide />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--color-border)" }} />
        <Area
          type="monotone"
          dataKey="v"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SkillRadar({ height = 210 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={radarData} outerRadius="72%">
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
        />
        <Radar
          dataKey="v"
          stroke="var(--color-chart-2)"
          fill="var(--color-chart-2)"
          fillOpacity={0.35}
        />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function MatchPie({ height = 200 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={pieData} dataKey="v" innerRadius="58%" outerRadius="85%" paddingAngle={4}>
          {pieData.map((e) => (
            <Cell key={e.name} fill={e.fill} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function WeeklyBars({ height = 180 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={barData}>
        <XAxis
          dataKey="d"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="v" radius={[8, 8, 8, 8]} fill="var(--color-chart-2)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Compact fake product surface used in the hero. */
export function DashboardMockup() {
  return (
    <div className="glass-panel overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Career readiness</p>
          <p className="font-display text-lg font-semibold">Flight deck</p>
        </div>
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="surface-card grid place-items-center p-3">
          <ScoreGauge value={86} label="Resume score" size={120} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="surface-card p-3">
            <p className="text-xs text-muted-foreground">ATS score</p>
            <p className="font-display text-2xl font-semibold text-gradient">92%</p>
            <TrendChart height={48} />
          </div>
          <div className="surface-card space-y-3 p-3">
            <ProgressBar value={78} label="Skill match" />
            <ProgressBar value={64} label="Roadmap" />
          </div>
        </div>
      </div>

      <div className="surface-card mt-3 p-3">
        <p className="text-xs text-muted-foreground">Weekly learning velocity</p>
        <WeeklyBars height={92} />
      </div>
    </div>
  );
}
