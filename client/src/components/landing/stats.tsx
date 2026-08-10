import { Counter, Reveal } from "@/components/motion-primitives";

const stats = [
  { value: 10, suffix: "K+", label: "Resumes Analyzed" },
  { value: 95, suffix: "%", label: "ATS Accuracy" },
  { value: 250, suffix: "+", label: "Career Roadmaps" },
  { value: 50, suffix: "+", label: "AI Assessments Generated" },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="glass-panel grid grid-cols-2 gap-y-10 p-8 sm:p-10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl font-semibold sm:text-5xl">
              <Counter to={s.value} suffix={s.suffix} className="text-gradient" />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
