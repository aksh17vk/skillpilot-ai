import { motion } from "motion/react";
import {
  FileSearch,
  Briefcase,
  GitCompareArrows,
  Map,
  ClipboardCheck,
  MessagesSquare,
  LayoutDashboard,
} from "lucide-react";
import { Reveal } from "@/components/motion-primitives";

const features = [
  {
    icon: FileSearch,
    title: "AI Resume Analyzer",
    points: ["Upload resume", "ATS score", "Resume feedback", "Skill extraction"],
    span: "lg:col-span-2",
  },
  {
    icon: Briefcase,
    title: "Job Description Analyzer",
    points: ["Role requirements", "Keyword coverage", "Seniority signals"],
    span: "",
  },
  {
    icon: GitCompareArrows,
    title: "Skill Gap Engine",
    points: ["Match percentage", "Missing skills", "Priority ranking"],
    span: "",
  },
  {
    icon: Map,
    title: "Learning Roadmap Generator",
    points: ["Weekly learning plan", "Recommended courses", "Timeline"],
    span: "lg:col-span-2",
  },
  {
    icon: ClipboardCheck,
    title: "AI Assessment",
    points: ["Technical MCQs", "Coding questions", "Instant evaluation"],
    span: "",
  },
  {
    icon: MessagesSquare,
    title: "AI Career Assistant",
    points: ["Career guidance", "Interview preparation", "24/7 copilot"],
    span: "",
  },
  {
    icon: LayoutDashboard,
    title: "Career Dashboard",
    points: ["Progress tracking", "History", "Analytics"],
    span: "",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
      <Reveal className="max-w-2xl">
        <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
          Capabilities
        </span>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Everything you need to go from <span className="text-gradient">applicant to hire</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          One connected system. Every insight feeds the next step of your career plan.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06} className={f.span}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="surface-card lift group relative h-full overflow-hidden p-6"
            >
              <div className="bg-brand absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />
              <div className="glass relative grid size-11 place-items-center rounded-2xl">
                <f.icon className="size-5 text-accent" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="bg-brand size-1.5 rounded-full" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
