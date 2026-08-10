import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  Bot,
  Briefcase,
  ClipboardCheck,
  FileSearch,
  GitCompareArrows,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuroraBackground } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Resume Analyzer", to: "/resume-analyzer", icon: FileSearch },
  { label: "Job Analyzer", to: "/job-analyzer", icon: Briefcase },
  { label: "Skill Gap", to: "/skill-gap", icon: GitCompareArrows },
  { label: "Roadmap", to: "/roadmap", icon: Map },
  { label: "Assessment", to: "/assessment", icon: ClipboardCheck },
  { label: "AI Chat", to: "/chat", icon: Bot },
  { label: "Profile", to: "/profile", icon: User },
] as const;

function getInitials(name?: string): string {
  if (!name || !name.trim()) return "SP";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SP";
  if (parts.length === 1) return (parts[0] ?? "SP").slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase() || "SP";
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const { user, logout } = useAuth();
  const initials = getInitials(user?.fullName);

  return (
    <>
      <div className="flex items-center justify-between gap-2 px-2 py-3">
        <Logo size="sm" />
        <button
          type="button"
          aria-label="Close menu"
          onClick={onNavigate}
          className="glass grid size-9 shrink-0 place-items-center rounded-full lg:hidden"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav aria-label="Main" className="mt-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200",
                active
                  ? "bg-brand text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="surface-card mt-4 shrink-0 p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="bg-brand grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold text-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{user.fullName}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      )}
    </>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const initials = getInitials(user?.fullName);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Loading SkillPilot AI…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh">
      <AuroraBackground />

      {/* Desktop sidebar */}
      <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-1 rounded-r-3xl p-4 lg:flex">
        <SidebarNav pathname={pathname} onNavigate={() => {}} />
      </aside>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="glass fixed inset-y-0 left-0 z-50 flex w-[min(17rem,85vw)] flex-col gap-1 rounded-r-3xl p-4 lg:hidden"
            >
              <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 lg:pl-64">
        <header className="glass sticky top-0 z-30 flex items-center justify-between gap-2 px-3 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="glass grid size-10 shrink-0 place-items-center rounded-full lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">SkillPilot AI</p>
              <h1 className="font-display truncate text-base font-semibold sm:text-lg">{title}</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Link to="/profile" aria-label="Profile" className="flex items-center gap-2">
              <span className="bg-brand grid size-10 place-items-center rounded-full text-xs font-semibold text-primary-foreground">
                {initials}
              </span>
            </Link>
            <button
              onClick={logout}
              title="Log out"
              className="glass grid size-10 place-items-center rounded-full text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-6xl min-w-0 px-4 py-6 sm:px-6 sm:py-8"
        >
          {description && <p className="mb-6 text-sm text-muted-foreground">{description}</p>}
          {children}
        </motion.main>
      </div>
    </div>
  );
}
