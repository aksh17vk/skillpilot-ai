import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Fade + rise on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Animated number counter that starts when scrolled into view. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/** Character-by-character typing effect. */
export function Typewriter({
  text,
  speed = 34,
  className,
  startDelay = 0,
  showCaret = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  startDelay?: number;
  showCaret?: boolean;
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {shown}
      {showCaret && shown.length < text.length && (
        <span className="animate-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-current" />
      )}
    </span>
  );
}

/** Ambient animated gradient blobs used as page background. */
export function AuroraBackground({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 overflow-hidden [contain:paint] bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_35%)]",
          className,
        )}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden [contain:paint] bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_28%)]",
        className,
      )}
    >
      <div className="grid-lines absolute inset-0 opacity-60" />
      {!reduceMotion && (
        <>
          <div className="animate-blob absolute -top-40 -left-32 size-[22rem] rounded-full bg-primary/25 blur-[80px] will-change-transform sm:size-[38rem] sm:blur-[120px]" />
          <div className="animate-blob absolute -top-24 right-0 size-[18rem] rounded-full bg-secondary/25 blur-[80px] will-change-transform [animation-delay:-6s] sm:size-[32rem] sm:blur-[120px]" />
          <div className="animate-blob absolute top-1/2 left-1/3 hidden size-[30rem] rounded-full bg-accent/20 blur-[130px] will-change-transform [animation-delay:-12s] sm:block" />
        </>
      )}
    </div>
  );
}
