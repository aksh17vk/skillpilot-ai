import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import { DashboardGrid } from "@/components/app/dashboard-grid";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Career Dashboard — SkillPilot AI" },
      {
        name: "description",
        content:
          "Track resume score, ATS readiness, skill match, roadmap progress and study consistency in one place.",
      },
      { property: "og:title", content: "Career Dashboard — SkillPilot AI" },
      {
        property: "og:description",
        content: "Your live career readiness analytics, powered by SkillPilot AI.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await api.getDashboard();
        setData(res);
      } catch (err) {
        // Handle error gracefully
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const name = user?.fullName || data?.user?.fullName || "Developer";

  return (
    <AppShell title="Dashboard" description={`Welcome back, ${name}. Here's your real readiness snapshot.`}>
      <DashboardGrid data={data} loading={loading} />
    </AppShell>
  );
}
