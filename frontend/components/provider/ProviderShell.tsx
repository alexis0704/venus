"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, MapPinned, Plus, Zap } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/host/financial", label: "Finance", icon: BarChart3 },
  { href: "/host/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/host/spots", label: "Spots", icon: MapPinned },
];

export function ProviderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPage = navItems.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#f5faf7] text-[#0d1f18]">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-emerald-900/10 bg-white/85 backdrop-blur-xl lg:left-72">
        <header className="flex h-14 items-center gap-3 px-3 sm:h-16 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2 lg:hidden">
            <Zap size={18} fill="currentColor" className="text-emerald-500" />
            <span className="font-bold tracking-tight">Volzen</span>
            <span className="truncate rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 sm:hidden">
              {currentPage}
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
              Provider account
            </span>
            <Link
              href="/host/spots"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0d1f18] px-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/10 sm:px-4"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Add spot</span>
            </Link>
          </div>
        </header>
      </div>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-emerald-900/10 bg-white/90 px-4 py-5 backdrop-blur-xl lg:block">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-emerald-500 text-[#0d1f18]">
            <Zap size={19} fill="currentColor" />
          </span>
          <div>
            <p className="font-bold tracking-tight">Volzen</p>
            <p className="text-xs text-emerald-800/60">Host dashboard</p>
          </div>
        </Link>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active ? "bg-emerald-500 text-[#0d1f18] shadow-lg shadow-emerald-500/20" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="px-3 pb-28 pt-[70px] sm:px-6 sm:pt-20 lg:ml-72 lg:pb-10">
        <div className="mx-auto max-w-7xl min-w-0">{children}</div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-3 rounded-[28px] border border-emerald-900/10 bg-white/90 p-2 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition ${
                active ? "bg-emerald-500 text-[#0d1f18]" : "text-slate-500"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function ProviderCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-[24px] border border-emerald-900/10 bg-white p-4 shadow-sm shadow-emerald-950/5 sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

export function StatusBadge({ tone, children }: { tone: "green" | "orange" | "red" | "blue" | "gray"; children: ReactNode }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    orange: "bg-orange-50 text-orange-700 ring-orange-600/15",
    red: "bg-red-50 text-red-700 ring-red-600/15",
    blue: "bg-sky-50 text-sky-700 ring-sky-600/15",
    gray: "bg-slate-100 text-slate-600 ring-slate-500/15",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[tone]}`}>{children}</span>;
}
