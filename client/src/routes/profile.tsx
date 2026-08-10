import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/app/metrics";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — SkillPilot AI" },
      {
        name: "description",
        content: "Manage your career profile, target role, skills and experience on SkillPilot AI.",
      },
      { property: "og:title", content: "Your Profile — SkillPilot AI" },
      { property: "og:description", content: "Keep your career profile sharp and current." },
    ],
  }),
  component: ProfilePage,
});

function getInitials(name?: string): string {
  if (!name || !name.trim()) return "SP";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SP";
  if (parts.length === 1) return (parts[0] ?? "SP").slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase() || "SP";
}

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [latestResume, setLatestResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [headline, setHeadline] = useState("");
  const [dailyHours, setDailyHours] = useState("2");
  const [preferredStudyTime, setPreferredStudyTime] = useState("Evening");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prof, resume] = await Promise.all([
          api.getProfile(),
          api.getLatestResume().catch(() => null),
        ]);
        if (prof) {
          setProfileData(prof);
          setFullName(prof.fullName || user?.fullName || "");
          setTargetRole(prof.targetRole || "");
          setLocation(prof.location || "");
          setBio(prof.bio || "");
          setHeadline(prof.headline || "");
          setDailyHours(String(prof.dailyHours || 2));
          setPreferredStudyTime(prof.preferredStudyTime || "Evening");
        }
        if (resume) {
          setLatestResume(resume);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        fullName,
        targetRole,
        location,
        bio,
        headline,
        dailyHours: Number(dailyHours),
        preferredStudyTime,
      });
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  const initials = getInitials(fullName || user?.fullName);
  const skills: string[] = latestResume?.analysis?.skills || [];
  const atsScore = latestResume?.analysis?.atsScore || 0;

  // Calculate completeness based on real fields filled
  const fields = [fullName, user?.email, targetRole, location, bio, headline];
  const filledCount = fields.filter((f) => Boolean(f && f.trim())).length;
  const completeness = Math.round((filledCount / fields.length) * 100);

  return (
    <AppShell title="Profile" description="This context personalizes every analysis and roadmap.">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="surface-card p-6 text-center">
          <span className="bg-brand mx-auto grid size-20 place-items-center rounded-full text-xl font-semibold text-primary-foreground">
            {initials}
          </span>
          <h2 className="mt-4 text-lg font-semibold">{fullName || user?.fullName || "Your Profile"}</h2>
          <p className="text-sm text-muted-foreground">{targetRole || "Set your target role"}</p>
          {location && <p className="text-xs text-muted-foreground mt-0.5">{location}</p>}

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {skills.length > 0 ? (
              skills.map((s) => (
                <Badge key={s} variant="outline" className="glass rounded-full">
                  {s}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Upload a resume to show extracted skills.</span>
            )}
          </div>
          <div className="mt-6 space-y-3 text-left">
            <ProgressBar value={completeness} label="Profile completeness" />
            <ProgressBar value={atsScore} label="ATS score" hint={atsScore ? `${atsScore}%` : "No resume"} />
          </div>
        </div>

        <form className="surface-card space-y-5 p-6" onSubmit={handleSave}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled
                value={user?.email || ""}
                className="h-11 rounded-xl opacity-70 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Target role</Label>
              <Input
                id="role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Backend Engineer"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India"
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dailyHours">Preferred daily study hours</Label>
              <Input
                id="dailyHours"
                type="number"
                min="1"
                max="12"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredStudyTime">Preferred study time</Label>
              <Input
                id="preferredStudyTime"
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                placeholder="e.g. Evening / Morning"
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Summary / Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your career journey, experience, or goals…"
              className="rounded-xl"
            />
          </div>
          <Button type="submit" variant="hero" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
