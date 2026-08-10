import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Check, RotateCcw, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Q = {
  q: string;
  options: string[];
  answer: number;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  explain: string;
};

export const questions: Q[] = [
  {
    q: "Which React hook memoizes an expensive computed value between renders?",
    options: ["useEffect", "useMemo", "useRef", "useReducer"],
    answer: 1,
    difficulty: "Easy",
    topic: "React",
    explain: "useMemo caches the result of a computation until its dependencies change.",
  },
  {
    q: "In Docker, what does a multi-stage build primarily reduce?",
    options: ["Build time only", "Final image size", "Container CPU usage", "Network latency"],
    answer: 1,
    difficulty: "Medium",
    topic: "Docker",
    explain: "Build tooling stays in earlier stages, so only runtime artifacts ship.",
  },
  {
    q: "Which MongoDB index best supports a query filtering on `status` then sorting by `createdAt`?",
    options: [
      "Single index on createdAt",
      "Compound index { status: 1, createdAt: -1 }",
      "Text index on status",
      "Hashed index on status",
    ],
    answer: 1,
    difficulty: "Hard",
    topic: "MongoDB",
    explain: "Equality field first, then the sort field — the ESR rule.",
  },
];

function Ring({ progress }: { progress: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width="64" height="64" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-muted" />
      <motion.circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        className="stroke-primary"
        strokeDasharray={c}
        animate={{ strokeDashoffset: c - c * progress }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

const diffTone = {
  Easy: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Hard: "bg-destructive/15 text-destructive border-destructive/30",
};

export function Quiz() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (done) return;
    setSeconds(45);
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [index, done]);

  const current = questions[index]!;

  const next = () => {
    if (picked === current.answer) setScore((s) => s + 1);
    if (index + 1 >= questions.length) setDone(true);
    else setIndex((i) => i + 1);
    setPicked(null);
  };

  const reset = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 text-center"
      >
        <p className="text-xs tracking-[0.2em] text-accent uppercase">Result</p>
        <p className="font-display mt-3 text-6xl font-semibold text-gradient">{pct}%</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {score} of {questions.length} correct
        </p>
        <div className="surface-card mt-6 p-5 text-left">
          <p className="text-sm font-semibold">AI feedback</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {pct >= 67
              ? "Strong fundamentals. Push into system design and container orchestration to reach senior-track readiness."
              : "Solid start. Revisit indexing strategy and Docker build layers, then retake to unlock the next roadmap week."}
          </p>
        </div>
        <Button variant="hero" className="mt-6" onClick={reset}>
          <RotateCcw /> Retake assessment
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative grid place-items-center">
            <Ring progress={(index + 1) / questions.length} />
            <span className="absolute text-xs font-semibold">
              {index + 1}/{questions.length}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold">{current.topic} assessment</p>
            <p className="text-xs text-muted-foreground">AI generated · adaptive difficulty</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn("rounded-full", diffTone[current.difficulty])}>
            {current.difficulty}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="size-3.5" /> 0:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <h3 className="text-lg font-semibold">{current.q}</h3>
          <div className="mt-5 grid gap-2.5">
            {current.options.map((o, i) => {
              const isPicked = picked === i;
              const reveal = picked !== null;
              const correct = i === current.answer;
              return (
                <button
                  key={o}
                  type="button"
                  disabled={reveal}
                  onClick={() => setPicked(i)}
                  className={cn(
                    "surface-card flex items-center justify-between gap-3 p-4 text-left text-sm transition-all duration-300",
                    !reveal && "hover:-translate-y-0.5 hover:border-primary/50",
                    reveal && correct && "border-success/60 bg-success/10",
                    reveal && isPicked && !correct && "border-destructive/60 bg-destructive/10",
                  )}
                >
                  {o}
                  {reveal && correct && <Check className="size-4 text-success" />}
                  {reveal && isPicked && !correct && <X className="size-4 text-destructive" />}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-muted-foreground"
            >
              {current.explain}
            </motion.p>
          )}

          <Button variant="hero" className="mt-6 w-full" disabled={picked === null} onClick={next}>
            {index + 1 === questions.length ? "Finish" : "Next question"}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
