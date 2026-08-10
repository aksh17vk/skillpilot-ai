import { motion } from "motion/react";
import { Bot, Send, User } from "lucide-react";
import { Reveal, Typewriter } from "@/components/motion-primitives";

export function ChatPreview() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            AI career assistant
          </span>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            A copilot that knows <span className="text-gradient">your resume</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ask anything: how to phrase a bullet, what to learn next, how to answer a system design
            question. Answers are grounded in your own profile and target role.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
            {[
              "Context-aware resume rewrites",
              "Role-specific interview drills",
              "Explains every ATS deduction",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="bg-brand size-1.5 rounded-full" /> {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12}>
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="glass-panel relative p-5"
          >
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <span className="bg-brand grid size-9 place-items-center rounded-2xl">
                <Bot className="size-4 text-primary-foreground" />
              </span>
              <div>
                <p className="text-sm font-semibold">SkillPilot Copilot</p>
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-success" /> Online
                </p>
              </div>
            </div>

            <div className="space-y-4 py-5">
              <div className="flex justify-end gap-2">
                <p className="bg-brand max-w-[78%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-primary-foreground">
                  How can I improve my resume?
                </p>
                <span className="glass grid size-8 shrink-0 place-items-center rounded-full">
                  <User className="size-3.5" />
                </span>
              </div>

              <div className="flex gap-2">
                <span className="glass grid size-8 shrink-0 place-items-center rounded-full">
                  <Bot className="size-3.5 text-accent" />
                </span>
                <p className="surface-card max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
                  <Typewriter
                    text="Your resume matches 78% of the target role. Add Docker, Kubernetes, and measurable achievements to improve your ATS score."
                    speed={22}
                    startDelay={600}
                  />
                </p>
              </div>
            </div>

            <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5">
              <span className="flex-1 text-sm text-muted-foreground">Ask about your career…</span>
              <span className="bg-brand grid size-8 place-items-center rounded-full">
                <Send className="size-3.5 text-primary-foreground" />
              </span>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
