import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Day = { date: Date; level: number; tasks: number };

const LABELS = ["No activity", "Light", "Steady", "Focused", "Deep work"];

function buildDays(weeks: number): Day[] {
  const out: Day[] = [];
  const today = new Date();
  const total = weeks * 7;
  for (let i = total - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // deterministic pseudo-random so SSR and client agree
    const seed = (date.getDate() * 31 + (date.getMonth() + 1) * 17 + date.getDay() * 7) % 23;
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    let level = seed % 5;
    if (weekend && level > 2) level -= 2;
    const tasks = level === 0 ? 0 : level * 2 + (seed % 3);
    out.push({ date, level, tasks });
  }
  return out;
}

const levelClass = [
  "bg-muted",
  "bg-accent/45",
  "bg-accent/75",
  "bg-primary/80",
  "bg-secondary shadow-[0_0_14px_2px_color-mix(in_oklab,var(--secondary)_60%,transparent)]",
];

export function ConsistencyHeatmap({
  weeks = 20,
  className,
}: {
  weeks?: number;
  className?: string;
}) {
  const days = useMemo(() => buildDays(weeks), [weeks]);
  const [active, setActive] = useState<{ day: Day; x: number; y: number } | null>(null);




  const totalTasks = days.reduce((s, d) => s + d.tasks, 0);

  const show = (el: HTMLElement, day: Day) => {
    const r = el.getBoundingClientRect();
    const parent = el.offsetParent?.getBoundingClientRect();
    setActive({
      day,
      x: r.left - (parent?.left ?? 0) + r.width / 2,
      y: r.top - (parent?.top ?? 0),
    });
  };

  return (
    <div className={cn("relative min-w-0", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold">Consistency</h3>
          <p className="text-xs text-muted-foreground">
            {totalTasks} tasks completed in the last {weeks} weeks
          </p>
        </div>
        <div className="hidden items-center gap-1.5 text-[10px] text-muted-foreground sm:flex">
          <span>Less</span>
          {levelClass.map((c, i) => (
            <span key={i} className={cn("size-3 rounded-[4px]", c)} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Responsive auto-fill grid: the number of columns adapts to the available
          width and every cell stays a 1:1 square, so nothing overflows the card. */}
      <div
        className="mt-4 grid w-full min-w-0 max-w-full gap-[3px] [--cell:1.125rem] sm:gap-[5px] sm:[--cell:1.5rem] lg:[--cell:1.75rem]"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(var(--cell), 1fr))" }}
        role="img"
        aria-label={`Activity heatmap: ${totalTasks} tasks completed in the last ${weeks} weeks`}
      >
        {days.map((day) => (
          <button
            key={day.date.toISOString()}
            type="button"
            onMouseEnter={(e) => show(e.currentTarget, day)}
            onMouseLeave={() => setActive(null)}
            onFocus={(e) => show(e.currentTarget, day)}
            onBlur={() => setActive(null)}
            onClick={(e) => show(e.currentTarget, day)}
            aria-label={`${day.date.toDateString()}: ${day.tasks} tasks`}
            className={cn(
              "relative aspect-square w-full min-w-0 rounded-[4px] transition-transform duration-200 hover:z-10 hover:scale-110 sm:rounded-[5px]",
              levelClass[day.level],
            )}
          />
        ))}
      </div>


      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground sm:hidden">
        <span>Less</span>
        {levelClass.map((c, i) => (
          <span key={i} className={cn("size-2.5 rounded-[3px]", c)} />
        ))}
        <span>More</span>
      </div>

      {active && (
        <div
          className="glass-panel pointer-events-none absolute z-20 max-w-[min(14rem,80vw)] -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-xl px-3 py-2 text-xs"
          style={{ left: active.x, top: active.y }}
        >
          <p className="font-medium">
            {active.day.date.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-muted-foreground">{LABELS[active.day.level]}</p>
          <p className="text-muted-foreground">{active.day.tasks} tasks completed</p>
        </div>
      )}
    </div>
  );
}
