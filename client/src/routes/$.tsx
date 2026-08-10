import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Compass } from "lucide-react";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found — SkillPilot AI" },
      {
        name: "description",
        content: "This route drifted off course. Head back to SkillPilot AI and keep flying.",
      },
      { property: "og:title", content: "Page not found — SkillPilot AI" },
      { property: "og:description", content: "This route drifted off course." },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center sm:py-32">
        <motion.span
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="glass grid size-20 place-items-center rounded-3xl"
        >
          <Compass className="size-9 text-accent" />
        </motion.span>
        <h1 className="font-display mt-8 text-7xl font-semibold text-gradient sm:text-8xl">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Off the flight path</h2>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist or has moved. Let's get you back on course.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/">
              <ArrowLeft /> Back home
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </section>
    </MarketingLayout>
  );
}
