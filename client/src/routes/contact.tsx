import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { MarketingLayout, PageHeader } from "@/components/site/marketing-layout";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SkillPilot AI" },
      {
        name: "description",
        content:
          "Questions, campus partnerships or support — reach the SkillPilot AI team and hear back within a day.",
      },
      { property: "og:title", content: "Contact SkillPilot AI" },
      { property: "og:description", content: "Talk to the team about support or campus plans." },
    ],
  }),
  component: ContactPage,
});

const channels = [
  { icon: Mail, label: "Email", value: "hello@skillpilot.ai" },
  { icon: MessageSquare, label: "Support", value: "Weekdays, 9am–7pm IST" },
  { icon: MapPin, label: "Based in", value: "Bengaluru, India" },
];

function ContactPage() {
  return (
    <MarketingLayout>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk"
        description="Product questions, campus partnerships or a bug worth fixing — we read everything."
      />

      <section className="mx-auto grid max-w-5xl gap-4 px-5 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="surface-card h-full space-y-6 p-7">
            {channels.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <span className="glass grid size-10 shrink-0 place-items-center rounded-2xl">
                  <c.icon className="size-4 text-accent" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-sm font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            className="surface-card space-y-5 p-7"
            onSubmit={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLFormElement).reset();
              toast.success("Message sent", { description: "We'll reply within one business day." });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cname">Name</Label>
                <Input id="cname" required placeholder="Your name" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cemail">Email</Label>
                <Input
                  id="cemail"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="csubject">Subject</Label>
              <Input id="csubject" placeholder="Campus partnership" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cmsg">Message</Label>
              <Textarea id="cmsg" required rows={6} placeholder="Tell us more…" className="rounded-xl" />
            </div>
            <Button type="submit" variant="hero" size="lg">
              Send message
            </Button>
          </form>
        </Reveal>
      </section>
    </MarketingLayout>
  );
}
