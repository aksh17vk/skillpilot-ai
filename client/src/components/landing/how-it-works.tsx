import { motion } from "motion/react";
import { Upload, Brain, ClipboardList, GitCompareArrows, Map, ClipboardCheck, Bot, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";

const steps = [
  { icon: Upload, title: "Upload Resume", desc: "PDF or DOCX, parsed in seconds." },
  { icon: Brain, title: "AI Analyzes", desc: "Structure, keywords, impact, ATS." },
  { icon: ClipboardList, title: "Paste Job Description", desc: "Any role, any company." },
  { icon: GitCompareArrows, title: "Skill Gap Detection", desc: "What's missing and why." },
  { icon: Map, title: "Roadmap Generation", desc: "A week-by-week study plan." },
  { icon: ClipboardCheck, title: "Take Assessment", desc: "Prove the new skills." },
  { icon: Bot, title: "Chat with AI", desc: "Interview prep on demand." },
  { icon: TrendingUp, title: "Track Progress", desc: "Watch readiness climb." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-28 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Eight steps. One <span className="text-gradient">career flight path</span>.
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-brand absolute top-6 right-0 left-0 hidden h-px origin-left lg:block z-0"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-brand absolute top-0 bottom-0 left-6 w-px origin-top lg:hidden z-0"
          />

          <ol className="grid gap-8 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <li className="relative pl-16 lg:pl-0 lg:z-10">
                  <div className="glass absolute top-0 left-0 grid size-12 place-items-center rounded-2xl lg:relative lg:mb-5">
                    <s.icon className="size-5 text-accent" />
                    <span className="bg-brand absolute -top-2 -right-2 grid size-5 place-items-center rounded-full text-[10px] font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
