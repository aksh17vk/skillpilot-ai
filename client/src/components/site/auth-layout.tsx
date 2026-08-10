import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuroraBackground } from "@/components/motion-primitives";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <AuroraBackground />

      <div className="hidden flex-col justify-between p-12 lg:flex">
        <Logo size="md" />
        <div>
          <h2 className="max-w-md text-4xl font-semibold">
            Your career, <span className="text-gradient">instrumented</span>.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Resume scoring, gap analysis, roadmaps and assessments — one continuous loop that ends
            with an offer.
          </p>
          <div className="mt-8 flex gap-8">
            {[
              ["10K+", "Resumes analyzed"],
              ["95%", "ATS accuracy"],
              ["250+", "Roadmaps"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-semibold text-gradient">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SkillPilot AI</p>
      </div>

      <div className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center justify-between lg:justify-end">
          <span className="lg:hidden">
            <Logo size="sm" />
          </span>
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel mx-auto my-auto w-full max-w-md p-8"
        >
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
