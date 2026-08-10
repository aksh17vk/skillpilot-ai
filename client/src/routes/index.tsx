import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { ChatPreview } from "@/components/landing/chat-preview";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { AssessmentSection } from "@/components/landing/assessment-section";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillPilot AI — From Resume to Career Readiness" },
      {
        name: "description",
        content:
          "AI resume analysis, ATS scoring, skill gap detection, personalized roadmaps and AI assessments. Become industry-ready with SkillPilot AI.",
      },
      { property: "og:title", content: "SkillPilot AI — From Resume to Career Readiness" },
      {
        property: "og:description",
        content:
          "The AI Career Operating System for students, freshers and job seekers. Analyze, plan, practice, get hired.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <MarketingLayout>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <ChatPreview />
      <RoadmapSection />
      <AssessmentSection />
      <Testimonials />
      <FAQ />

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <Reveal>
          <div className="glass-panel relative overflow-hidden p-10 text-center sm:p-16">
            <div className="bg-brand absolute inset-x-0 -top-24 mx-auto size-72 rounded-full opacity-30 blur-[100px]" />
            <h2 className="relative text-3xl font-semibold sm:text-5xl">
              Your next role starts with <span className="text-gradient">one upload</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of students turning scattered effort into a measurable career plan.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/register">
                  Start Free <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </MarketingLayout>
  );
}
