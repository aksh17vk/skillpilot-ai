import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Wand2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScoreGauge, ProgressBar } from "@/components/app/metrics";
import { MatchPie } from "@/components/app/charts";
import { api } from "@/services/api";

export const Route = createFileRoute("/job-analyzer")({
  head: () => ({ meta: [{ title: "Job Description Analyzer — SkillPilot AI" }] }),
  component: JobAnalyzer,
});

function JobAnalyzer() {
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function loadLatest() {
      try {
        const latest = await api.getLatestJob();
        if (latest) {
          setResult(latest.analysis || latest);
          setJobDescription(latest.description || "");
          setAnalyzed(true);
        }
      } catch (err) {
        // No job analyzed yet
      }
    }
    loadLatest();
  }, []);

  async function analyze() {
    if (!jobDescription.trim()) {
      toast.error("Paste a job description first.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.analyzeJob(jobDescription, roleTitle);
      const dataObj = res.analysis || res;
      setResult(dataObj);
      setAnalyzed(true);
      toast.success("Job description analyzed successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Job analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const analysisData = result?.analysis || result;
  const required: string[] = analysisData?.requiredSkills || [];
  const resumeSkills: string[] = analysisData?.resumeSkills || [];
  const matched: string[] = analysisData?.skillGap?.matchedSkills || [];
  const missing: string[] = analysisData?.skillGap?.missingSkills || [];
  const match = Number(analysisData?.skillGap?.matchPercentage ?? 0);

  return (
    <AppShell
      title="Job Analyzer"
      description="Paste a job description to see how the role maps onto your uploaded resume."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6 flex flex-col justify-between">
          <div>
            <Input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Role title (e.g. Backend Engineer)"
              className="h-11 rounded-xl"
            />
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={14}
              placeholder="Paste the complete job description here…"
              className="mt-3 rounded-xl"
            />
          </div>
          <Button variant="hero" className="mt-4 w-full" onClick={analyze} disabled={loading}>
            <Wand2 /> {loading ? "Analyzing job & calculating skill gap…" : "Analyze job description"}
          </Button>
        </div>

        <div>
          {!analyzed ? (
            <div className="surface-card grid min-h-[400px] place-items-center p-8 text-center">
              <div>
                <Sparkles className="mx-auto size-8 text-accent" />
                <h3 className="mt-3 text-lg font-semibold">No Job Analysis Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Paste a job description on the left and click "Analyze job description" to see calculated skill matches and gaps.
                </p>
              </div>
            </div>
          ) : (
            <motion.div animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-4">
              <div className="surface-card grid gap-4 p-6 sm:grid-cols-2">
                <div className="grid place-items-center">
                  <ScoreGauge value={match} label="Match %" sublabel={roleTitle || "Target role"} />
                </div>
                <MatchPie height={170} />
              </div>
              <div className="surface-card p-6">
                <h3 className="text-sm font-semibold">Required skills extracted from JD</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {required.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className={
                        matched.some((m) => m.toLowerCase() === s.toLowerCase())
                          ? "rounded-full border-success/40 bg-success/15 text-success"
                          : "rounded-full border-destructive/40 bg-destructive/15 text-destructive"
                      }
                    >
                      {s}
                    </Badge>
                  ))}
                  {!required.length && (
                    <span className="text-sm text-muted-foreground">No required skills extracted.</span>
                  )}
                </div>
              </div>
              <div className="surface-card p-6">
                <h3 className="text-sm font-semibold">Skill Gap</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <SkillColumn title="Matched Skills" items={matched} good />
                  <SkillColumn title="Missing Skills" items={missing} />
                </div>
              </div>
              <div className="surface-card space-y-4 p-6">
                <h3 className="text-sm font-semibold">Resume Coverage</h3>
                <ProgressBar value={match} label={`${resumeSkills.length} skills from your resume evaluated`} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function SkillColumn({ title, items, good }: { title: string; items: string[]; good?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length ? (
          items.map((x) => (
            <Badge
              key={x}
              variant="outline"
              className={good ? "rounded-full border-success/40 text-success" : "rounded-full border-destructive/40 text-destructive"}
            >
              {x}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </div>
    </div>
  );
}
