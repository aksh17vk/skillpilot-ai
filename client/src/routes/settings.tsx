import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Moon, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SkillPilot AI" },
      {
        name: "description",
        content: "Control appearance, notifications, privacy and data on your SkillPilot AI account.",
      },
      { property: "og:title", content: "Settings — SkillPilot AI" },
      { property: "og:description", content: "Appearance, notifications and data controls." },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { id: "weekly", label: "Weekly progress digest", desc: "A Monday summary of your readiness." },
  { id: "roadmap", label: "Roadmap reminders", desc: "Nudge me when a week is falling behind." },
  { id: "jobs", label: "Matching role alerts", desc: "Ping me when a saved role fits above 85%." },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <AppShell title="Settings" description="Tune SkillPilot AI to the way you work.">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-6">
          <h2 className="text-sm font-semibold">Appearance</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Theme follows your system on first visit, then remembers your choice.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { key: "light", label: "Light", icon: Sun },
              { key: "dark", label: "Dark", icon: Moon },
              { key: "system", label: "System", icon: Monitor },
            ].map((opt) => {
              const active =
                opt.key === "system"
                  ? false
                  : theme === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    if (opt.key === "system") {
                      const sys = window.matchMedia("(prefers-color-scheme: light)").matches
                        ? "light"
                        : "dark";
                      setTheme(sys);
                      toast.success("Following system theme");
                    } else {
                      setTheme(opt.key as "light" | "dark");
                    }
                  }}
                  className={cn(
                    "surface-card grid place-items-center gap-2 p-4 text-xs transition-all duration-300 hover:-translate-y-0.5",
                    active && "border-primary/60 glow",
                  )}
                >
                  <opt.icon className="size-4 text-accent" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <div className="mt-5 space-y-5">
            {toggles.map((t, i) => (
              <div key={t.id} className="flex items-start justify-between gap-4">
                <div>
                  <Label htmlFor={t.id} className="text-sm">
                    {t.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <Switch id={t.id} defaultChecked={i !== 2} />
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-sm font-semibold">Privacy</h2>
          <div className="mt-5 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor="anon" className="text-sm">
                  Anonymized benchmarking
                </Label>
                <p className="text-xs text-muted-foreground">
                  Compare my scores against peers without sharing identity.
                </p>
              </div>
              <Switch id="anon" defaultChecked />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor="train" className="text-sm">
                  Improve models with my data
                </Label>
                <p className="text-xs text-muted-foreground">Off by default. You stay in control.</p>
              </div>
              <Switch id="train" />
            </div>
          </div>
        </section>

        <section className="surface-card border-destructive/30 p-6">
          <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Permanently delete all uploaded resumes, analyses and roadmaps.
          </p>
          <Button
            variant="destructive"
            className="mt-5"
            onClick={() => toast("Deletion requires email confirmation")}
          >
            <Trash2 /> Delete all data
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
