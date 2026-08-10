import { Link } from "@tanstack/react-router";
import logo from "@/assets/skillpilot-logo.png";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
  withWordmark?: boolean;
  asLink?: boolean;
};

const sizes = {
  sm: { box: "size-7", text: "text-base" },
  md: { box: "size-9", text: "text-lg" },
  lg: { box: "size-12", text: "text-2xl" },
};

export function Logo({ className, size = "md", withWordmark = true, asLink = true }: Props) {
  const s = sizes[size];
  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-grid place-items-center">
        <span className="bg-brand absolute inset-0 rounded-xl opacity-25 blur-lg transition-opacity duration-300 group-hover:opacity-50" />
        <img
          src={logo}
          alt="SkillPilot AI logo"
          width={960}
          height={960}
          className={cn(s.box, "relative object-contain drop-shadow-sm")}
        />
      </span>
      {withWordmark && (
        <span className={cn("font-display font-semibold tracking-tight", s.text)}>
          SkillPilot<span className="text-gradient"> AI</span>
        </span>
      )}
    </span>
  );

  if (!asLink) return content;
  return (
    <Link to="/" aria-label="SkillPilot AI home">
      {content}
    </Link>
  );
}
