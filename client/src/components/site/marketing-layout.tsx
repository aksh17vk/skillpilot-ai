import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AuroraBackground } from "@/components/motion-primitives";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <AuroraBackground />
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pt-28"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-10 pb-14 text-center">
      {eyebrow && (
        <span className="glass inline-flex rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h1>
      {description && <p className="mt-4 text-base text-muted-foreground">{description}</p>}
    </div>
  );
}
