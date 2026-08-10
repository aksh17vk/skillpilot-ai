import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ScoreGauge({
  value,
  label,
  sublabel,
  size = 148,
  className,
}: {
  value: number;
  label: string;
  sublabel?: string;
  size?: number;
  className?: string;
}) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `gauge-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" />
            <stop offset="55%" stopColor="var(--color-chart-2)" />
            <stop offset="100%" stopColor="var(--color-chart-3)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={`url(#${id})`}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * value) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-3xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sublabel && <p className="text-[10px] text-accent">{sublabel}</p>}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  label,
  hint,
}: {
  value: number;
  label: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{hint ?? `${value}%`}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="bg-brand h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
