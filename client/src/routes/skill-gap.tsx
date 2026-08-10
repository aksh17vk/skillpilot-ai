import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/app/metrics";
import { SkillRadar } from "@/components/app/charts";
import { api } from "@/services/api";

export const Route = createFileRoute("/skill-gap")({
  head: () => ({
    meta: [
      { title: "Skill Gap Analysis — SkillPilot AI" },
      {
        name: "description",
        content:
          "See the exact skills standing between your resume and your target role, ranked by hiring impact.",
      },
      { property: "og:title", content: "Skill Gap Analysis — SkillPilot AI" },
      {
        property: "og:description",
        content: "Ranked, actionable skill gaps for your target role.",
      },
    ],
  }),
  component: SkillGap,
});

function SkillGap() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkillGap() {
      try {
        setLoading(true);
        const result = await api.getSkillGap();
        setData(result);
      } catch (err) {
        // Handle no data case
      } finally {
        setLoading(false);
      }
    }
    loadSkillGap();
  }, []);

  const skillGapObj = data?.skillGap || {};
  const matchedSkills: string[] = skillGapObj.matchedSkills || [];
  const missingSkills: string[] = skillGapObj.missingSkills || [];
  const matchPercentage = skillGapObj.matchPercentage ?? 0;
  const targetRole = data?.latestJob?.title || "Target Role";

  const hasData = Boolean(data && (matchedSkills.length > 0 || missingSkills.length > 0));

  return (
    <AppShell
      title="Skill Gap"
      description="Real skill gap evaluation comparing your resume skills against required job skills."
    >
      {!hasData && !loading ? (
        <div className="surface-card grid min-h-[350px] place-items-center p-8 text-center">
          <div>
            <Sparkles className="mx-auto size-8 text-accent" />
            <h3 className="mt-3 text-lg font-semibold">No Skill Gap Data Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload your resume and analyze a job description to generate your real skill gap profile.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button asChild variant="hero">
                <Link to="/resume-analyzer">Upload Resume</Link>
              </Button>
              <Button asChild variant="glass">
                <Link to="/job-analyzer">Analyze Job</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Gap Breakdown ({targetRole})</h2>
              <Badge variant="outline" className="glass rounded-full">
                {matchPercentage}% match
              </Badge>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Missing Skills ({missingSkills.length})
                </h3>
                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="rounded-full border-destructive/40 bg-destructive/15 text-destructive py-1 px-3 text-xs"
                      >
                        <Flame className="mr-1 size-3" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-success">No missing skills detected! You match 100% of required skills.</p>
                )}
              </div>

              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Matched Skills ({matchedSkills.length})
                </h3>
                {matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="rounded-full border-success/40 bg-success/15 text-success py-1 px-3 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No matching skills found in resume for this role.</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <ProgressBar value={matchPercentage} label="Overall Match Score" hint={`${matchPercentage}%`} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="surface-card p-6">
              <h2 className="text-sm font-semibold">Competency Radar</h2>
              <SkillRadar height={280} />
            </div>
            <div className="surface-card p-6">
              <h2 className="text-sm font-semibold">Close the Gap</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Generate a personalized step-by-step roadmap to master missing skills and boost your job match score.
              </p>
              <Button asChild variant="hero" className="mt-5 w-full">
                <Link to="/roadmap">
                  Generate Roadmap <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
