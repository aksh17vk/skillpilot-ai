import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "SDE-1 @ fintech startup",
    initials: "AM",
    rating: 5,
    text: "My ATS score went from 61 to 94 in two weeks. The skill gap report told me exactly what recruiters were filtering me out for.",
  },
  {
    name: "Sneha Iyer",
    role: "Final year, CSE",
    initials: "SI",
    rating: 5,
    text: "The six-week roadmap replaced three months of random YouTube tutorials. I finally knew what to learn next, every single day.",
  },
  {
    name: "Rohit Kulkarni",
    role: "Career switcher",
    initials: "RK",
    rating: 4,
    text: "The AI copilot rewrote my project bullets with real metrics. Three interview calls in the week after.",
  },
  {
    name: "Priya Nair",
    role: "Data analyst",
    initials: "PN",
    rating: 5,
    text: "The assessments are genuinely hard and the feedback is specific. It felt like having a mentor on call.",
  },
  {
    name: "Dev Sharma",
    role: "Fresher, ECE",
    initials: "DS",
    rating: 5,
    text: "Uploading a JD and instantly seeing my match percentage changed how I apply. I stopped spraying resumes.",
  },
];

export function Testimonials() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden py-20">
      <Reveal className="mx-auto max-w-2xl px-5 text-center">
        <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Loved by</span>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Students who stopped <span className="text-gradient">guessing</span>
        </h2>
      </Reveal>

      <div className="group relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <motion.div
          className="flex gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((t, i) => (
            <article
              key={i}
              className="glass-panel w-[min(19rem,80vw)] shrink-0 p-5 transition-transform duration-300 hover:-translate-y-1.5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="bg-brand grid size-10 place-items-center rounded-full text-sm font-semibold text-primary-foreground">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`size-3.5 ${s < t.rating ? "fill-warning text-warning" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.text}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
