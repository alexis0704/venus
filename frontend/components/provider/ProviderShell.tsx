"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, MapPinned, Plus } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/host/financial", label: "Finance", icon: BarChart3 },
  { href: "/host/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/host/spots", label: "Spots", icon: MapPinned },
];

// ponytail: pending count is demo-static; wire to real API when auth lands
const PENDING_COUNT = 2;

export function ProviderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPage = navItems.find((item) => item.href === pathname)?.label ?? "Dashboard";
  const showAddSpotAction = pathname !== "/host/spots";

  return (
    <div className="min-h-dvh overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Top bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 lg:left-[220px]"
        style={{ borderBottom: "1px solid var(--glass-border)", background: "color-mix(in srgb, var(--bg) 85%, transparent)", backdropFilter: "blur(14px)" }}
      >
        <header className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:px-6">
          {/* Mobile: wordmark */}
          <Link href="/" className="lg:hidden font-bold tracking-tight" style={{ color: "var(--text)" }}>
            VOLZEN
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
            >
              Provider account
            </span>
            {showAddSpotAction && (
              <Link
                href="/host/spots"
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold sm:px-4 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
              >
                <Plus size={15} /> <span className="hidden sm:inline">Add spot</span>
              </Link>
            )}
          </div>
        </header>
      </div>

      {/* Desktop sidebar — Instagram web style */}
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden w-[220px] flex-col py-6 lg:flex"
        style={{ borderRight: "1px solid var(--glass-border)", background: "var(--bg)" }}
      >
        <Link href="/" className="mb-8 px-5">
          <p className="font-bold text-lg tracking-tight" style={{ color: "var(--text)" }}>VOLZEN</p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Host dashboard</p>
        </Link>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const pending = item.href === "/host/bookings" && PENDING_COUNT > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-150 hover:opacity-80"
                style={{
                  background: active ? "var(--glass-bg)" : "transparent",
                  color: active ? "var(--text)" : "var(--text-muted)",
                  borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
                <span>{item.label}</span>
                {pending && (
                  <span
                    className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center"
                    style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                  >
                    {PENDING_COUNT > 99 ? "99+" : PENDING_COUNT}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="px-3 pb-28 pt-[70px] sm:px-6 sm:pt-20 lg:ml-[220px] lg:pb-10">
        <div className="mx-auto max-w-7xl min-w-0">{children}</div>
      </main>

      {/* Mobile bottom nav — Instagram style: full-width, opaque, thin top border */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 grid grid-cols-3 lg:hidden"
        style={{
          borderTop: "1px solid var(--glass-border)",
          background: "var(--bg)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const pending = item.href === "/host/bookings" && PENDING_COUNT > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold transition-opacity duration-150 hover:opacity-70"
              style={{ color: active ? "var(--text)" : "var(--text-muted)" }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
              <span>{item.label}</span>
              {pending && (
                <span
                  className="absolute top-2 right-[calc(50%-14px)] rounded-full px-1 text-[9px] font-bold min-w-[14px] text-center leading-4"
                  style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                >
                  {PENDING_COUNT > 99 ? "99+" : PENDING_COUNT}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function ProviderCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`min-w-0 rounded-xl p-4 sm:p-5 ${className}`}
      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
    >
      {children}
    </section>
  );
}

export function StatusBadge({ tone, children }: { tone: "green" | "orange" | "red" | "slate" | "gray" | "white" | "yellow" | "purple"; children: ReactNode }) {
  const styles: Record<string, React.CSSProperties> = {
    green:  { background: "rgba(74,222,128,0.15)",  color: "#4ade80" },
    orange: { background: "rgba(251,146,60,0.15)",  color: "#fb923c" },
    red:    { background: "rgba(239,68,68,0.15)",   color: "#ef4444" },
    yellow: { background: "rgba(234,179,8,0.15)",   color: "#eab308" },
    purple: { background: "rgba(168,85,247,0.15)",  color: "#a855f7" },
    slate:  { background: "rgba(226,232,240,0.12)", color: "#e2e8f0" },
    white:  { background: "rgba(255,255,255,0.12)", color: "#ffffff" },
    gray:   { background: "rgba(148,163,184,0.15)", color: "#94a3b8" },
  };

  return (
    <span className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold" style={styles[tone]}>
      {children}
    </span>
  );
}
