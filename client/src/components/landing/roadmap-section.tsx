import { motion } from "motion/react";
import { Check, Lock } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

export const roadmapWeeks = [
  { week: 1, topic: "JavaScript", detail: "ES2023, async patterns, closures, event loop", done: true },
  { week: 2, topic: "React", detail: "Hooks, state architecture, performance", done: true },
  { week: 3, topic: "Node.js", detail: "Express, auth, REST design, testing", done: true },
  { week: 4, topic: "MongoDB", detail: "Schema design, aggregation, indexing", done: false },
  { week: 5, topic: "Docker", detail: "Images, compose, multi-stage builds", done: false },
  { week: 6, topic: "System Design", detail: "Caching, queues, scaling, trade-offs", done: false },
];

export function RoadmapSection() {
  const [active, setActive] = useState(3);

  return (
    <section id="roadmap" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
      <Reveal className="max-w-2xl">
        <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Roadmap</span>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Six weeks to <span className="text-gradient">interview ready</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roadmapWeeks.map((w, i) => (
          <Reveal key={w.week} delay={i * 0.06}>
            <motion.button
              type="button"
              onClick={() => setActive(i)}
              whileHover={{ y: -5 }}
              className={cn(
                "surface-card w-full p-5 text-left transition-colors",
                active === i && "border-primary/60 glow",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                  Week {w.week}
                </span>
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full",
                    w.done ? "bg-brand" : "glass",
                  )}
                >
                  {w.done ? (
                    <Check className="size-3.5 text-primary-foreground" />
                  ) : (
                    <Lock className="size-3 text-muted-foreground" />
                  )}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{w.topic}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{w.detail}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="bg-brand h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: w.done ? "100%" : active === i ? "45%" : "0%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </motion.button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
