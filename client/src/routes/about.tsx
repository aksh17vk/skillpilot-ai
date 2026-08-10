import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, HeartHandshake, Radar, ShieldCheck } from "lucide-react";
import { MarketingLayout, PageHeader } from "@/components/site/marketing-layout";
import { Reveal, Counter } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SkillPilot AI — Careers, instrumented" },
      {
        name: "description",
        content:
          "Why we built SkillPilot AI: closing the gap between what students learn and what employers actually screen for.",
      },
      { property: "og:title", content: "About SkillPilot AI" },
      {
        property: "og:description",
        content: "Closing the gap between what you learn and what employers screen for.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Radar,
    title: "Evidence over vibes",
    body: "Every score traces back to a signal a recruiter or ATS actually looks at.",
  },
  {
    icon: Compass,
    title: "Direction, not noise",
    body: "One prioritized next step beats a hundred bookmarked courses.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, yours",
    body: "Resumes are never sold, never used to train models without consent.",
  },
  {
    icon: HeartHandshake,
    title: "Access first",
    body: "The free plan is genuinely enough to land your first role.",
  },
];

const stats = [
  { value: 10000, suffix: "+", label: "Resumes analyzed" },
  { value: 95, suffix: "%", label: "ATS parity accuracy" },
  { value: 250, suffix: "+", label: "Roadmaps generated" },
  { value: 40, suffix: "%", label: "Avg. score lift" },
];

function AboutPage() {
  return (
    <MarketingLayout>
      <PageHeader
        eyebrow="About us"
        title="Careers, instrumented"
        description="SkillPilot AI began as a placement-week frustration: brilliant students rejected by keyword filters they never saw. We turned that black box into a dashboard."
      />

      <section className="mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="glass-panel grid gap-6 p-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-semibold text-gradient">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-5">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">What we believe</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07}>
              <div className="surface-card lift h-full p-7">
                <span className="glass grid size-11 place-items-center rounded-2xl">
                  <v.icon className="size-5 text-accent" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-5 text-center">
        <Reveal>
          <div className="surface-card glow p-10">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Ready to see your <span className="text-gradient">real</span> score?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Upload a resume and get an ATS breakdown in under a minute.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-7">
              <Link to="/register">Start free</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </MarketingLayout>
  );
}
