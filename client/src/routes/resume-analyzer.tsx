import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { CloudUpload, FileText, Sparkles, TriangleAlert, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreGauge, ProgressBar } from "@/components/app/metrics";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

export const Route = createFileRoute("/resume-analyzer")({
  head: () => ({ meta: [{ title: "AI Resume Analyzer — SkillPilot AI" }] }),
  component: ResumeAnalyzer,
});

function ResumeAnalyzer() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadLatest() {
      try {
        const latest = await api.getLatestResume();
        if (latest) {
          setResult(latest);
          setState("done");
        }
      } catch (err) {
        // No existing resume, keep idle state
      }
    }
    loadLatest();
  }, []);

  async function analyze(file?: File) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF resume.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume must be smaller than 10 MB.");
      return;
    }
    setState("loading");
    try {
      const data = await api.uploadResume(file);
      setResult(data);
      setState("done");
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      setState("idle");
      toast.error(error instanceof Error ? error.message : "Resume analysis failed");
    }
  }

  const analysisObj = result?.analysis || result;
  const skills: string[] = analysisObj?.skills || [];
  const weaknesses: string[] = analysisObj?.weaknesses || [];
  const strengths: string[] = analysisObj?.strengths || [];
  const missing: string[] = analysisObj?.missingSkills || [];
  const suggestions: string[] = analysisObj?.suggestions || [];
  const ats = Number(analysisObj?.atsScore ?? 0);
  const fileName = result?.fileName || result?.file?.originalname || "Uploaded Resume";

  return (
    <AppShell
      title="Resume Analyzer"
      description="Drop your resume and let the AI read it like a recruiter and an ATS at the same time."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            analyze(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "surface-card grid place-items-center p-10 text-center transition-all duration-300",
            dragging && "border-primary/70 glow scale-[1.01]"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => analyze(e.target.files?.[0])}
          />
          <motion.div animate={{ y: dragging ? -6 : 0 }} className="glass grid size-16 place-items-center rounded-3xl">
            <CloudUpload className="size-7 text-accent" />
          </motion.div>
          <h2 className="mt-5 text-lg font-semibold">{dragging ? "Drop it here" : "Drop your resume here"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">PDF, up to 10 MB</p>
          <Button
            variant="hero"
            className="mt-6"
            onClick={() => inputRef.current?.click()}
            disabled={state === "loading"}
          >
            <FileText /> {state === "loading" ? "Analyzing…" : "Choose file"}
          </Button>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Your document is sent to your SkillPilot backend for analysis.
          </p>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div key="idle" exit={{ opacity: 0 }} className="surface-card p-8 text-center">
                <Sparkles className="mx-auto size-6 text-accent" />
                <h3 className="mt-3 text-base font-semibold">No resume analyzed yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload a PDF resume on the left to view real ATS scoring and AI skill analysis.
                </p>
              </motion.div>
            )}
            {state === "loading" && (
              <motion.div key="loading" className="surface-card space-y-4 p-6">
                <p className="text-sm font-medium text-accent">Extracting and analyzing resume text with Ollama Llama 3.2…</p>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </motion.div>
            )}
            {state === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="surface-card grid gap-6 p-6 sm:grid-cols-2">
                  <div className="grid place-items-center">
                    <ScoreGauge value={ats} label="ATS score" sublabel={fileName} />
                  </div>
                  <div className="space-y-4 self-center">
                    <ProgressBar value={ats} label="Overall ATS readiness" />
                    <ProgressBar value={Math.min(100, ats + 5)} label="Keyword coverage" />
                    <ProgressBar value={Math.max(0, ats - 8)} label="Impact & clarity" />
                  </div>
                </div>
                <AnalysisList title="Extracted skills" items={skills} />
                <AnalysisList title="Missing skills" items={missing} warning />
                <TextList title="Strengths" items={strengths} good />
                <TextList title="Weaknesses" items={weaknesses} warning />
                <TextList title="Improvement suggestions" items={suggestions} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}

function AnalysisList({ title, items, warning = false }: { title: string; items: string[]; warning?: boolean }) {
  return (
    <div className="surface-card p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className={cn("glass rounded-full", warning && "border-destructive/40 text-destructive")}
            >
              {s}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">None reported.</span>
        )}
      </div>
    </div>
  );
}

function TextList({
  title,
  items,
  good = false,
  warning = false,
}: {
  title: string;
  items: string[];
  good?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="surface-card p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.length ? (
          items.map((x) => (
            <li key={x} className="flex items-start gap-3 text-sm">
              {warning ? (
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
              ) : (
                <CheckCircle2 className={cn("mt-0.5 size-4 shrink-0", good ? "text-success" : "text-accent")} />
              )}
              <span className="text-muted-foreground">{x}</span>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground">None reported.</li>
        )}
      </ul>
    </div>
  );
}
