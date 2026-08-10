import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/app-shell";
import { Quiz } from "@/components/app/quiz";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "AI Assessment — SkillPilot AI" },
      {
        name: "description",
        content:
          "AI-generated technical MCQs and coding questions with instant evaluation and feedback.",
      },
      { property: "og:title", content: "AI Assessment — SkillPilot AI" },
      { property: "og:description", content: "Prove your skills with adaptive AI assessments." },
    ],
  }),
  component: AssessmentPage,
});

const history = [
  { topic: "JavaScript", score: 92, date: "Aug 2" },
  { topic: "React", score: 84, date: "Jul 28" },
  { topic: "Node.js", score: 77, date: "Jul 21" },
];

function AssessmentPage() {
  return (
    <AppShell
      title="Assessment"
      description="Adaptive questions generated from your current roadmap week."
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Quiz />
        <div className="space-y-4">
          <div className="surface-card p-6">
            <h2 className="text-sm font-semibold">Past attempts</h2>
            <ul className="mt-4 space-y-3">
              {history.map((h) => (
                <li key={h.topic} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{h.topic}</p>
                    <p className="text-[11px] text-muted-foreground">{h.date}</p>
                  </div>
                  <Badge variant="outline" className="glass rounded-full">
                    {h.score}%
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-6">
            <h2 className="text-sm font-semibold">How scoring works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Each answer is weighted by difficulty. Scoring above 70% unlocks the next roadmap week
              and updates your readiness score.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
