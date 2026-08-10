import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { FileText, Sparkles, Wand2, Map, CheckCircle2, ArrowRight } from "lucide-react";
import { ScoreGauge, ProgressBar } from "@/components/app/metrics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Widget({
  title,
  children,
  className,
  action,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: string;
}) {
  return (
    <motion.section
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250, damping: 22 }}
      className={`surface-card lift min-w-0 max-w-full overflow-hidden p-4 sm:p-5 ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className="font-display min-w-0 truncate text-sm font-semibold">{title}</h3>
        {action && <span className="shrink-0 text-[11px] text-muted-foreground">{action}</span>}
      </div>
      <div className="mt-4 min-w-0">{children}</div>
    </motion.section>
  );
}

export function DashboardGrid({ data, loading }: { data: any; loading: boolean }) {
  if (loading) {
    return (
      <div className="surface-card p-12 text-center">
        <div className="inline-block size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm text-muted-foreground">Loading your career dashboard…</p>
      </div>
    );
  }

  const resume = data?.resume;
  const jobAnalysis = data?.jobAnalysis;
  const roadmap = data?.roadmap;
  const profile = data?.profile;

  const atsScore = resume?.atsScore ?? null;
  const matchPercentage = jobAnalysis?.matchPercentage ?? null;
  const targetRole = profile?.targetRole || roadmap?.targetRole || "Target Role";
  const resumeSkills: string[] = resume?.skills || [];
  const missingSkills: string[] = jobAnalysis?.missingSkills || [];
  const matchedSkills: string[] = jobAnalysis?.matchedSkills || [];
  const hasJobAnalysis = Boolean(
    jobAnalysis &&
      (jobAnalysis.matchPercentage !== undefined ||
        jobAnalysis.requiredSkills?.length ||
        jobAnalysis.resumeSkills?.length ||
        matchedSkills.length ||
        missingSkills.length)
  );

  // Build real activities list from database timestamps
  const activities: Array<{ icon: any; text: string; meta: string; tone: string }> = [];

  if (resume?.fileName) {
    activities.push({
      icon: FileText,
      text: `Uploaded resume: ${resume.fileName}`,
      meta: resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : "Uploaded",
      tone: "text-accent",
    });
  }

  if (jobAnalysis?.matchPercentage !== undefined) {
    activities.push({
      icon: Wand2,
      text: `Analyzed Job Description (${jobAnalysis.matchPercentage}% match)`,
      meta: jobAnalysis.createdAt ? new Date(jobAnalysis.createdAt).toLocaleDateString() : "Analyzed",
      tone: "text-success",
    });
  }

  if (roadmap?.targetRole) {
    activities.push({
      icon: Map,
      text: `Generated Roadmap: ${roadmap.targetRole}`,
      meta: roadmap.createdAt ? new Date(roadmap.createdAt).toLocaleDateString() : "Generated",
      tone: "text-secondary",
    });
  }

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. Resume Score */}
      <Widget title="Career Readiness / ATS Score" action={resume ? resume.fileName : "No resume"}>
        {atsScore !== null ? (
          <div className="flex flex-col items-center justify-center">
            <ScoreGauge value={atsScore} label="ATS Score" sublabel="AI Evaluated" />
            <p className="mt-2 text-xs text-muted-foreground text-center">
              {resumeSkills.length} skills extracted from your uploaded resume.
            </p>
          </div>
        ) : (
          <div className="p-4 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No resume uploaded yet.</p>
            <Button asChild variant="hero" size="sm" className="mt-4">
              <Link to="/resume-analyzer">Upload Resume</Link>
            </Button>
          </div>
        )}
      </Widget>

      {/* 2. Job Match */}
      <Widget title="Job Match Percentage" action={targetRole}>
        {hasJobAnalysis ? (
          <div className="space-y-3">
            <p className="font-display text-4xl font-semibold text-gradient">{matchPercentage}%</p>
            <p className="text-xs text-muted-foreground">
              Calculated match between your resume skills and required job skills.
            </p>
            <ProgressBar value={matchPercentage} label="Role Match" />
          </div>
        ) : (
          <div className="p-4 text-center">
            <Wand2 className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No job analysis performed yet.</p>
            <Button asChild variant="hero" size="sm" className="mt-4">
              <Link to="/job-analyzer">Analyze Job Description</Link>
            </Button>
          </div>
        )}
      </Widget>

      {/* 3. Target Role & Profile */}
      <Widget title="Target Career Profile">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Target Role</p>
            <p className="text-lg font-semibold">{targetRole || "Not specified"}</p>
          </div>
          {profile?.location && (
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{profile.location}</p>
            </div>
          )}
          <div className="pt-2 border-t border-border flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Daily Study Goal</span>
            <Badge variant="outline">{profile?.dailyHours || 2} hrs/day ({profile?.preferredStudyTime || "Evening"})</Badge>
          </div>
          <Button asChild variant="glass" size="sm" className="w-full mt-2">
            <Link to="/profile">Edit Profile</Link>
          </Button>
        </div>
      </Widget>

      {/* 4. Resume Skills */}
      <Widget title="Resume Skills" className="lg:col-span-1">
        {resumeSkills.length > 0 ? (
          <div>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
              {resumeSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="glass rounded-full text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Total {resumeSkills.length} skills identified by AI.
            </p>
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No resume skills extracted yet. Upload a resume to show extracted skills.
          </div>
        )}
      </Widget>

      {/* 5. Missing Skills / Skill Gaps */}
      <Widget title="Identified Skill Gaps" className="lg:col-span-1">
        {hasJobAnalysis ? (
          missingSkills.length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
                {missingSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="rounded-full border-destructive/40 bg-destructive/15 text-destructive text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {missingSkills.length} missing skills standing between your resume and target role.
              </p>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No missing skills! You match 100% of required skills.
            </div>
          )
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Analyze a job description to identify missing skill gaps.
          </div>
        )}
      </Widget>

      {/* 6. Latest Roadmap Status */}
      <Widget title="Latest AI Roadmap" className="lg:col-span-1">
        {roadmap ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-sm">{roadmap.targetRole}</h4>
              <Badge variant="outline">{roadmap.durationDays} Days</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {roadmap.days?.length || 0} module days scheduled at {roadmap.studyHoursPerDay} hrs/day.
            </p>
            <Button asChild variant="hero" size="sm" className="w-full mt-2">
              <Link to="/roadmap">
                View Full Roadmap <ArrowRight className="ml-1 size-3" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="p-4 text-center">
            <Sparkles className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No roadmap generated yet.</p>
            <Button asChild variant="hero" size="sm" className="mt-4">
              <Link to="/roadmap">Generate Roadmap</Link>
            </Button>
          </div>
        )}
      </Widget>

      {/* 7. Recent Activity */}
      <Widget title="Recent Career Activity" className="sm:col-span-2 lg:col-span-3">
        {activities.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-3">
            {activities.map((a, i) => (
              <li key={i} className="flex items-center gap-3 surface-card p-3 rounded-xl border border-border/50">
                <span className="glass grid size-9 shrink-0 place-items-center rounded-xl">
                  <a.icon className={`size-4 ${a.tone}`} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{a.text}</p>
                  <p className="text-[10px] text-muted-foreground">{a.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity logged yet. Start by uploading a resume or analyzing a job description.
          </p>
        )}
      </Widget>
    </div>
  );
}
