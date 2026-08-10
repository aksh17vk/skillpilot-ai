import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { MarketingLayout, PageHeader } from "@/components/site/marketing-layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion-primitives";
import { FAQ } from "@/components/landing/faq";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — SkillPilot AI" },
      {
        name: "description",
        content:
          "Start free, upgrade when you're serious. Transparent plans for students, freshers and career switchers.",
      },
      { property: "og:title", content: "Pricing — SkillPilot AI" },
      { property: "og:description", content: "Plans built for students and job seekers." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Pilot",
    price: "Free",
    note: "forever",
    desc: "Everything you need for your first offer.",
    features: [
      "5 resume analyses / month",
      "ATS score & feedback",
      "1 active roadmap",
      "Community assessments",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Captain",
    price: "₹499",
    note: "/month",
    desc: "For serious job seekers running a real search.",
    features: [
      "Unlimited resume analyses",
      "Unlimited JD comparisons",
      "Adaptive AI assessments",
      "Priority AI copilot",
      "Full analytics history",
    ],
    cta: "Upgrade to Captain",
    featured: true,
  },
  {
    name: "Campus",
    price: "Custom",
    note: "per institution",
    desc: "Placement cells and bootcamps at scale.",
    features: [
      "Cohort dashboards",
      "Bulk resume screening",
      "Placement analytics",
      "Dedicated support",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

function PricingPage() {
  return (
    <MarketingLayout>
      <PageHeader
        eyebrow="Pricing"
        title="Simple plans, serious outcomes"
        description="Start free. Upgrade only when the search gets real."
      />

      <section className="mx-auto grid max-w-6xl gap-4 px-5 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -6 }}
              className={cn(
                "surface-card relative flex h-full flex-col p-7",
                p.featured && "border-primary/60 glow",
              )}
            >
              {p.featured && (
                <span className="bg-brand absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium text-primary-foreground">
                  <Sparkles className="size-3" /> Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{p.price}</span>
                <span className="text-xs text-muted-foreground">{p.note}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.featured ? "hero" : "glass"}
                size="lg"
                className="mt-7 w-full"
              >
                <Link to={p.name === "Campus" ? "/contact" : "/register"}>{p.cta}</Link>
              </Button>
            </motion.div>
          </Reveal>
        ))}
      </section>

      <FAQ />
    </MarketingLayout>
  );
}
