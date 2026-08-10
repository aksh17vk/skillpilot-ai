import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, PlayCircle, Sparkles, Target, Bot, GraduationCap } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "@/components/app/charts";
import { Typewriter } from "@/components/motion-primitives";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 20 });
  const sy = useSpring(my, { stiffness: 90, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateX = useTransform(sy, [-0.5, 0.5], ["-6deg", "6deg"]);
  const driftX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const driftY = useTransform(sy, [-0.5, 0.5], [14, -14]);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative mx-auto grid max-w-6xl min-w-0 items-center gap-12 px-5 pt-8 pb-20 sm:gap-14 lg:grid-cols-[1.05fr_1fr] lg:pt-16"
    >
      <div>
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground"
        >
          <Sparkles className="size-3.5 text-accent" />
          The AI Career Operating System
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[clamp(2rem,8vw,3.75rem)] leading-[1.06] font-semibold text-balance"
        >
          From Resume to <span className="text-gradient">Career Readiness</span>, Powered by AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.14 }}
          className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          SkillPilot AI reads your resume, scores it against real job descriptions, finds your skill
          gaps and builds the exact weekly plan that gets you hired.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.22 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button asChild variant="hero" size="xl">
            <Link to="/register">
              Start Free <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="glass" size="xl">
            <Link to="/dashboard">
              <PlayCircle /> Watch Demo
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Bot className="size-4 text-accent" />
          <Typewriter
            text="Analyzing 1,248 job descriptions for Backend Engineer…"
            startDelay={900}
          />
        </motion.div>
      </div>

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <DashboardMockup />

        <motion.div
          style={{ x: driftX, y: driftY }}
          className="glass-panel animate-float absolute -top-8 -left-6 hidden w-44 p-3 sm:block"
        >
          <div className="flex items-center gap-2">
            <Target className="size-4 text-accent" />
            <p className="text-xs font-medium">Skill match</p>
          </div>
          <p className="font-display mt-1 text-2xl font-semibold text-gradient">78%</p>
        </motion.div>

        <motion.div
          style={{ x: driftY, y: driftX }}
          className="glass-panel animate-float-slow absolute -right-4 bottom-16 hidden w-48 p-3 sm:block"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-secondary" />
            <p className="text-xs font-medium">Roadmap</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Week 4 of 6 · MongoDB</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="bg-brand h-full w-[64%] rounded-full" />
          </div>
        </motion.div>

        <motion.div
          style={{ x: driftX }}
          className="glass-panel animate-float absolute -bottom-8 left-4 hidden w-52 p-3 [animation-delay:-3s] sm:block"
        >
          <p className="text-[11px] text-muted-foreground">AI Copilot</p>
          <p className="mt-1 text-xs">Add Docker & Kubernetes to jump +9 ATS points.</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
