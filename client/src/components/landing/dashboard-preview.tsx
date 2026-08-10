import { Reveal } from "@/components/motion-primitives";
import { DashboardGrid } from "@/components/app/dashboard-grid";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
      <Reveal className="max-w-2xl">
        <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
          Career dashboard
        </span>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Your readiness, <span className="text-gradient">measured live</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Scores, gaps, streaks and analytics in one calm command center.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <DashboardGrid data={null} loading={false} />
      </Reveal>
    </section>
  );
}
