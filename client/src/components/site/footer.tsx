import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const columns = [
  {
    title: "Quick links",
    items: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Resume Analyzer", to: "/resume-analyzer" },
      { label: "Job Analyzer", to: "/job-analyzer" },
      { label: "Roadmap", to: "/roadmap" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Pricing", to: "/pricing" },
      { label: "About", to: "/about" },
      { label: "Assessments", to: "/assessment" },
      { label: "AI Chat", to: "/chat" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Contact", to: "/contact" },
      { label: "Settings", to: "/settings" },
      { label: "Profile", to: "/profile" },
      { label: "Skill Gap", to: "/skill-gap" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The AI Career Operating System for students, freshers and job seekers who want to be
              industry-ready.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="glass grid size-9 place-items-center rounded-full hover:border-primary/50"
              >
                <Github className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="glass grid size-9 place-items-center rounded-full hover:border-primary/50"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href="mailto:hello@skillpilot.ai"
                aria-label="Email"
                className="glass grid size-9 place-items-center rounded-full hover:border-primary/50"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="surface-card mt-12 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-display text-lg font-semibold">Career insights, weekly</h4>
            <p className="text-sm text-muted-foreground">
              Hiring trends, ATS tips and roadmap updates. No spam.
            </p>
          </div>
          <form
            className="flex w-full gap-2 sm:w-auto"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("You're subscribed", { description: "Welcome aboard the flight deck." });
              (e.target as HTMLFormElement).reset();
            }}
          >
            <Input
              required
              type="email"
              name="email"
              placeholder="you@email.com"
              aria-label="Email address"
              className="h-11 min-w-0 rounded-full sm:w-64"
            />
            <Button type="submit" variant="hero" className="h-11 shrink-0">
              Subscribe <Send />
            </Button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SkillPilot AI. All rights reserved.</p>
          <p>Built for the next generation of engineers.</p>
        </div>
      </div>
    </footer>
  );
}
