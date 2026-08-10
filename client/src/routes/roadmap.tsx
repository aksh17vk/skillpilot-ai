import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BookOpen, Check, Download, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/app/metrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/roadmap")({
  head: () => ({ meta: [{ title: "Learning Roadmap — SkillPilot AI" }] }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Software Engineer");
  const [dailyHours, setDailyHours] = useState("2");
  const [preferredStudyTime, setPreferredStudyTime] = useState("Evening");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [durationDays, setDurationDays] = useState("30");
  const [currentSkills, setCurrentSkills] = useState("");
  const [missingSkills, setMissingSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);

  useEffect(() => {
    async function loadLatest() {
      try {
        const latest = await api.getLatestRoadmap();
        if (latest) {
          setRoadmapResult({
            targetRole: latest.targetRole,
            roadmap: {
              title: `${latest.targetRole} Roadmap`,
              preferredStudyTime: latest.preferredStudyTime || "Evening",
              dailyHours: latest.studyHoursPerDay || 2,
              daysPerWeek: latest.daysPerWeek || 5,
              durationDays: latest.durationDays || 30,
              days: latest.days || [],
            },
          });
          if (latest.targetRole) setTargetRole(latest.targetRole);
        }
      } catch (err) {
        // No roadmap generated yet
      }
    }
    loadLatest();
  }, []);

  async function generate() {
    if (!targetRole.trim()) {
      toast.error("Enter a target role.");
      return;
    }
    if (mode === "manual" && !missingSkills.trim()) {
      toast.error("Enter the skills you want to learn.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.generateRoadmap({
        mode,
        targetRole,
        dailyHours: Number(dailyHours),
        preferredStudyTime,
        daysPerWeek: Number(daysPerWeek),
        durationDays: Number(durationDays),
        ...(mode === "manual"
          ? {
              currentSkills: currentSkills.split(",").map((s) => s.trim()).filter(Boolean),
              missingSkills: missingSkills.split(",").map((s) => s.trim()).filter(Boolean),
            }
          : {}),
      });

      setRoadmapResult(result);
      toast.success("Personalized roadmap generated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Roadmap generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    if (!roadmapResult) return;
    setDownloading(true);
    try {
      const response = await api.downloadRoadmapPdf(roadmapResult);
      if (!response.ok) throw new Error("PDF generation failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${targetRole.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-roadmap.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Roadmap PDF downloaded successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF download failed");
    } finally {
      setDownloading(false);
    }
  }

  const daysData =
    roadmapResult?.roadmap?.days ||
    roadmapResult?.days ||
    roadmapResult?.schedule ||
    [];

  const roadmapTitle =
    roadmapResult?.roadmap?.title ||
    roadmapResult?.title ||
    `${targetRole} Roadmap`;

  return (
    <AppShell
      title="Learning Roadmap"
      description="Generate a personalized plan directly from your resume and job skill gap."
    >
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="surface-card h-fit space-y-4 p-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Generation mode</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant={mode === "auto" ? "hero" : "glass"} onClick={() => setMode("auto")}>
                Auto
              </Button>
              <Button variant={mode === "manual" ? "hero" : "glass"} onClick={() => setMode("manual")}>
                Manual
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {mode === "auto"
                ? "Uses your latest resume analysis and JD skill gap."
                : "Choose your current and missing skills yourself."}
            </p>
          </div>
          <Field label="Target role">
            <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Full Stack Developer" />
          </Field>
          {mode === "manual" && (
            <>
              <Field label="Current skills">
                <Textarea
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  placeholder="React, JavaScript, Node.js"
                />
              </Field>
              <Field label="Missing skills">
                <Textarea
                  value={missingSkills}
                  onChange={(e) => setMissingSkills(e.target.value)}
                  placeholder="TypeScript, Next.js, Testing"
                />
              </Field>
            </>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Daily hours">
              <Input
                type="number"
                min="1"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
              />
            </Field>
            <Field label="Days / week">
              <Input
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration (days)">
              <Input
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
              />
            </Field>
            <Field label="Study time">
              <Input
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
              />
            </Field>
          </div>
          <Button variant="hero" className="w-full" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? "Generating roadmap with AI…" : "Generate roadmap"}
          </Button>
          {roadmapResult && (
            <Button variant="glass" className="w-full" onClick={downloadPdf} disabled={downloading}>
              <Download /> {downloading ? "Preparing PDF…" : "Download PDF"}
            </Button>
          )}
        </div>

        <div>
          {!roadmapResult ? (
            <div className="surface-card grid min-h-[420px] place-items-center p-8 text-center">
              <Sparkles className="size-8 text-accent" />
              <div>
                <h2 className="mt-3 text-lg font-semibold">Your AI Roadmap Will Appear Here</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Generate it using Auto mode (from your resume + JD analysis) or define your own target skills with Manual mode.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="surface-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{roadmapTitle}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {targetRole} · {durationDays} days · {dailyHours} hrs/day · {daysPerWeek} days/week
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {mode} mode
                  </Badge>
                </div>
                <div className="mt-5">
                  <ProgressBar value={0} label="Progress" hint="Start your first task" />
                </div>
              </div>
              <div className="relative">
                <div className="bg-brand absolute top-2 bottom-2 left-[19px] w-px sm:left-[23px]" />
                <ol className="space-y-4">
                  {daysData.map((day: any, i: number) => (
                    <DayCard key={day.day ?? day.id ?? i} day={day} index={i} />
                  ))}
                </ol>
              </div>
              {!daysData.length && (
                <div className="surface-card p-6 text-sm text-muted-foreground">
                  A roadmap record exists, but no daily schedule items were found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}

function DayCard({ day, index }: { day: any; index: number }) {
  const number = day.day ?? day.dayNumber ?? index + 1;
  const focusTitle = day.focus || day.title || day.topic || day.skill || "Learning Module";
  const tasks: string[] = Array.isArray(day.tasks) ? day.tasks : day.task ? [day.task] : [];
  const topics: string[] = Array.isArray(day.topics) ? day.topics : [];
  const resources: string[] = Array.isArray(day.resources) ? day.resources : [];

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative pl-14 sm:pl-16"
    >
      <span className="glass absolute top-1 left-0 grid size-10 place-items-center rounded-2xl sm:size-12">
        <span className="text-sm font-semibold">{number}</span>
      </span>
      <div className="surface-card lift p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">
            Day {number} · {focusTitle}
          </h3>
          <Badge variant="outline" className="glass rounded-full">
            {day.hours ?? day.duration ?? "2"} hrs
          </Badge>
        </div>
        {day.schedule && <p className="mt-1 text-xs text-accent">{day.schedule}</p>}
        {topics.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {topics.map((tp, idx) => (
              <Badge key={idx} variant="glass" className="text-[11px]">
                {tp}
              </Badge>
            ))}
          </div>
        )}
        {tasks.length > 0 && (
          <ul className="mt-4 space-y-2">
            {tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                {task}
              </li>
            ))}
          </ul>
        )}
        {resources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {resources.map((r, i) => (
              <Badge key={i} variant="outline" className="glass">
                <BookOpen className="mr-1 size-3" />
                {r}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.li>
  );
}
