import { Reveal } from "@/components/motion-primitives";
import { Quiz } from "@/components/app/quiz";

export function AssessmentSection() {
  return (
    <section id="assessment" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Assessments
          </span>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Prove the skills you just <span className="text-gradient">learned</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every roadmap week ends with an AI-generated assessment: technical MCQs, coding
            questions and instant evaluation with explanations.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Quiz />
        </Reveal>
      </div>
    </section>
  );
}
