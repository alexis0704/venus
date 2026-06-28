"use client";

import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import {
  Zap,
  MapPin,
  Shield,
  Star,
  Users,
  Search,
  CalendarCheck,
  PlugZap,
  ChevronRight,
  Quote,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import { useRef, useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"] });
import ThemeToggle from "@/components/ThemeToggle";

/* ── Scroll Reveal ────────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? "visible" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function DelayedReveal({
  children,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
}) {
  return <Reveal delay={index * 80} className="h-full">{children}</Reveal>;
}

/* ── Static data ──────────────────────────────────────────── */

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Find nearby hosts",
    desc: "Open the map, filter by connector type and price, and discover hosts in minutes.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book a time slot",
    desc: "Pick your date and hours. Pricing is shown upfront — no surprise fees.",
  },
  {
    icon: PlugZap,
    step: "03",
    title: "Plug in & charge",
    desc: "Follow turn-by-turn directions to the host's address and start charging.",
  },
];

const FEATURES = [
  {
    icon: MapPin,
    title: "Live map search",
    desc: "See available stations in real time, with distance and price visible at a glance.",
  },
  {
    icon: Shield,
    title: "Upfront pricing",
    desc: "No hidden fees. Total cost shown before you book.",
  },
  {
    icon: Star,
    title: "Verified reviews",
    desc: "Real ratings from real drivers help you choose the best spot.",
  },
  {
    icon: Zap,
    title: "All connectors",
    desc: "Type 1, Type 2, CCS, CHAdeMO — filter by your car's plug.",
  },
  {
    icon: Users,
    title: "Earn as a host",
    desc: "Turn your home charger into passive income. Set your own hours and rate.",
  },
];

const TESTIMONIALS = [
  {
    name: "Lan Anh Nguyen",
    city: "Ho Chi Minh City",
    avatar: "https://i.pravatar.cc/64?img=5",
    rating: 5,
    text: "I was skeptical about EV charging in the city, but Volzen made it so easy. Found a host 0.8 km away with great amenities — coffee and AC included!",
  },
  {
    name: "Duc Huy Tran",
    city: "Hanoi",
    avatar: "https://i.pravatar.cc/64?img=8",
    rating: 5,
    text: "The map is super intuitive. I can see prices and connector types at a glance. Booked my first slot in under two minutes.",
  },
  {
    name: "Minh Thu Le",
    city: "Da Nang",
    avatar: "https://i.pravatar.cc/64?img=47",
    rating: 5,
    text: "As a VinFast owner I was worried about finding CCS2 spots. Volzen's filter made it instant. Never going back to commercial stations.",
  },
  {
    name: "Phuong Nam Vo",
    city: "Hue",
    avatar: "https://i.pravatar.cc/64?img=12",
    rating: 5,
    text: "The host was so welcoming. She made me tea while I waited. This is what sharing economy should feel like.",
  },
  {
    name: "Thanh Binh Pham",
    city: "Bien Hoa",
    avatar: "https://i.pravatar.cc/64?img=33",
    rating: 4,
    text: "Pricing is transparent and fair. I saved about 40% compared to the parking lot chargers near my office.",
  },
  {
    name: "Kim Chi Dang",
    city: "Can Tho",
    avatar: "https://i.pravatar.cc/64?img=21",
    rating: 5,
    text: "Set up as a host in 10 minutes. Earned my first booking the same evening. The payout came through next morning.",
  },
  {
    name: "Hoang Long Bui",
    city: "Vung Tau",
    avatar: "https://i.pravatar.cc/64?img=15",
    rating: 5,
    text: "Road trips are no longer stressful. I plan stops with Volzen hosts along the route. It's like having friends everywhere.",
  },
  {
    name: "Ngoc Tram Nguyen",
    city: "Nha Trang",
    avatar: "https://i.pravatar.cc/64?img=9",
    rating: 5,
    text: "I listed my Type 2 charger 3 months ago. Already covered half my electricity bill from hosting alone.",
  },
  {
    name: "Viet Hung Do",
    city: "Hai Phong",
    avatar: "https://i.pravatar.cc/64?img=52",
    rating: 5,
    text: "Clean app, zero junk. Find, book, charge. My Tesla Model 3 thanks Volzen every weekend.",
  },
  {
    name: "Bao Chau Tran",
    city: "Quy Nhon",
    avatar: "https://i.pravatar.cc/64?img=44",
    rating: 4,
    text: "The review system is trustworthy. Both sides rate each other so you always know what to expect.",
  },
];

const ROW1 = TESTIMONIALS.slice(0, 5);
const ROW2 = TESTIMONIALS.slice(5, 10);

const PRIMARY_BTN: React.CSSProperties = {
  background: "#111111",
  color: "#ffffff",
};

const PROVIDER_VERIFICATION_STATUS_KEY = "volzen.providerVerificationStatus";

/* ── Page ─────────────────────────────────────────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [showProviderVerificationBadge, setShowProviderVerificationBadge] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      const st = window.scrollY;
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translateY(${st * 0.3}px)`;
        heroContentRef.current.style.opacity = `${Math.max(0.5, 1 - st / 800)}`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setShowProviderVerificationBadge(
      window.localStorage.getItem(PROVIDER_VERIFICATION_STATUS_KEY) === "pending",
    );
  }, []);

  return (
    <div
      style={{ background: "var(--bg)", color: "var(--text)" }}
      className="flex flex-col overflow-x-hidden"
    >
      {/* ── Nav ──────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          borderBottom: "1px solid var(--divider)",
          backdropFilter: "blur(16px)",
          background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        }}
      >
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: "var(--text)" }}
            >
              VOLZEN
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Desktop nav links */}
            {showProviderVerificationBadge && (
              <Link
                href="/provider-onboarding?returning=true"
                className="hidden items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.98] sm:inline-flex"
                style={{
                  background: "rgba(15,118,110,0.12)",
                  border: "1px solid rgba(15,118,110,0.28)",
                  color: "#0f766e",
                }}
              >
                <AlertCircle size={14} />
                Verify host
              </Link>
            )}
            <Link
              href="/help"
              className="hidden sm:inline-block text-sm px-4 py-2 rounded-2xl transition-opacity hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              Help
            </Link>
            <Link
              href="/login"
              className="hidden sm:inline-block text-sm px-4 py-2 rounded-2xl transition-opacity hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="hidden sm:inline-block text-sm px-4 py-2 rounded-2xl font-medium transition-all hover:opacity-90 hover:scale-[1.02]"
              style={PRIMARY_BTN}
            >
              Get started
            </Link>

            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger
                className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                aria-label="Open menu"
              >
                <Menu size={18} style={{ color: "var(--text)" }} />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 p-0 border-l"
                style={{ background: "var(--bg)", borderColor: "var(--glass-border)" }}
              >
                <div className="flex flex-col h-full px-6 py-8 gap-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text)" }}>VOLZEN</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link href="/help" className="text-sm px-4 py-3 rounded-2xl transition-opacity hover:opacity-70" style={{ color: "var(--text-muted)" }}>Help</Link>
                    <Link href="/login" className="text-sm px-4 py-3 rounded-2xl transition-opacity hover:opacity-70" style={{ color: "var(--text-muted)" }}>Sign in</Link>
                    <Link
                      href="/signup"
                      className="mt-2 text-sm px-4 py-3 rounded-2xl font-medium text-center transition-all hover:opacity-90"
                      style={PRIMARY_BTN}
                    >
                      Get started
                    </Link>
                    {showProviderVerificationBadge && (
                      <Link
                        href="/provider-onboarding?returning=true"
                        className="mt-1 flex items-center gap-1.5 rounded-2xl px-4 py-3 text-xs font-semibold transition-all hover:opacity-90"
                        style={{ background: "rgba(15,118,110,0.12)", border: "1px solid rgba(15,118,110,0.28)", color: "#0f766e" }}
                      >
                        <AlertCircle size={14} />
                        Verify host
                      </Link>
                    )}
                  </div>
                  <div className="mt-auto">
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center px-6 min-h-svh overflow-hidden"
      >
        <div ref={heroContentRef} className="relative z-10">
          {showProviderVerificationBadge && (
            <Link
              href="/provider-onboarding?returning=true"
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "rgba(15,118,110,0.12)",
                border: "1px solid rgba(15,118,110,0.28)",
                color: "#0f766e",
              }}
            >
              <AlertCircle size={16} />
              Hoàn tất xác minh nhà cung cấp
            </Link>
          )}
          <h1
            className="text-6xl sm:text-8xl lg:text-9xl font-bold leading-[1.04] tracking-tight"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-serif)",
              letterSpacing: "-0.04em",
            }}
          >
            What&apos;s up,
            <br />
            <span style={{ color: "var(--accent)" }}>
              <u style={{ fontStyle: "italic" }}>power</u>'s up?
            </span>
          </h1>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto w-full px-6 pb-24"
      >
        <Reveal>
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "var(--text)" }}
            >
              From kerb to charged in minutes
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              From finding a spot to fully charged — all in one app.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <DelayedReveal key={s.step} index={i}>
                <div className="glass glass-hover p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          "color-mix(in srgb, var(--accent) 15%, transparent)",
                        border:
                          "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                      }}
                    >
                      <Icon size={18} style={{ color: "var(--accent)" }} />
                    </div>
                    <span
                      className="text-3xl font-black tabular-nums"
                      style={{
                        color:
                          "color-mix(in srgb, var(--text-muted) 30%, transparent)",
                      }}
                    >
                      {s.step}
                    </span>
                  </div>
                  <div>
                    <p
                      className="font-semibold mb-1.5"
                      style={{ color: "var(--text)" }}
                    >
                      {s.title}
                    </p>
                    <p
                      className="text-sm leading-6"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              </DelayedReveal>
            );
          })}
        </div>
      </section>

      {/* ── Features bento ───────────────────────────────────── */}
      <section id="features" className="max-w-5xl mx-auto w-full px-6 pb-24">
        <Reveal>
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "var(--text)" }}
            >
              Built for drivers, by drivers
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Everything you need to charge confidently, anywhere in Vietnam.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <DelayedReveal key={f.title} index={i}>
                <div className="glass glass-hover p-6 flex flex-col gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        "color-mix(in srgb, var(--accent) 12%, transparent)",
                      border:
                        "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                    }}
                  >
                    <Icon size={17} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: "var(--text)" }}
                    >
                      {f.title}
                    </p>
                    <p
                      className="text-sm leading-6"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              </DelayedReveal>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials carousel ────────────────────────────── */}
      <section className="w-full pb-24 overflow-hidden">
        <Reveal>
          <div className="text-center mb-12 px-6">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "var(--text)" }}
            >
              Drivers love it
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Real experiences from the Volzen community.
            </p>
          </div>
        </Reveal>

        <div className="overflow-hidden mb-4">
          <div
            className="flex gap-5"
            style={{
              width: "max-content",
              animation: "marquee 32s linear infinite",
              willChange: "transform",
            }}
          >
            {[...ROW1, ...ROW1].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-5"
            style={{
              width: "max-content",
              animation: "marquee-reverse 32s linear infinite",
              willChange: "transform",
            }}
          >
            {[...ROW2, ...ROW2].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — host angle ─────────────────────────────────── */}
      <section className="max-w-3xl mx-auto w-full px-6 pb-24">
        <Reveal>
          <div className="p-10 text-center">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "var(--text)" }}
            >
              Have a home charger?
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed mb-7 max-w-sm mx-auto"
              style={{ color: "var(--text-muted)" }}
            >
              Turn idle electricity into income. Set your own schedule and
              price. Volzen handles bookings and payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup?role=provider"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02]"
                style={PRIMARY_BTN}
              >
                Start earning <ChevronRight size={16} />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-medium text-base glass glass-hover"
                style={{ color: "var(--text)" }}
              >
                Find a charger instead
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="relative overflow-hidden">
        {/* Video background — full opacity, no blur */}
        <video
          src="https://framerusercontent.com/assets/q95rXa5cJvTHgllPhKynAcYgB0.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Top-to-transparent gradient so page bg bleeds into video top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, var(--bg) 0%, transparent 45%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-10 flex flex-col items-center gap-10">
          {/* Bold wordmark */}
          <span
            className={`${bebas.className} select-none leading-none tracking-wide`}
            style={{
              fontSize: "clamp(5rem, 18vw, 13rem)",
              background:
                "linear-gradient(135deg, #ffffff 0%, #E8E5DF 60%, #BBBBBB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mixBlendMode: "overlay",
            }}
          >
            VOLZEN
          </span>

          {/* Flat links */}
          <nav
            className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm"
            style={{
              color: "rgba(255,255,255,0.75)",
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            <Link
              href="/signup"
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              Sign in
            </Link>
            <Link
              href="/signup?role=provider"
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              Become a host
            </Link>
            <a
              href="#how-it-works"
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              How it works
            </a>
            <a
              href="#features"
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              Features
            </a>
            <a
              href="mailto:hello@volzen.vn"
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              Contact
            </a>
            <Link
              href="#"
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              Terms
            </Link>
          </nav>

          <p
            className="text-[10px]"
            style={{
              color: "rgba(255,255,255,0.4)",
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            © 2026 Volzen · EV Charging Network · Vietnam
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── Testimonial card ─────────────────────────────────────── */
function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <div className="glass p-5 flex flex-col gap-3 w-80 shrink-0">
      <Quote size={16} style={{ color: "var(--accent)", opacity: 0.5 }} />
      <p className="text-sm leading-6" style={{ color: "var(--text)" }}>
        &ldquo;{t.text}&rdquo;
      </p>
      <div
        className="flex items-center gap-3 mt-auto pt-2"
        style={{ borderTop: "1px solid var(--divider)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatar}
          alt={t.name}
          className="w-8 h-8 rounded-full object-cover border"
          style={{ borderColor: "var(--border)" }}
          width={32}
          height={32}
        />
        <div className="min-w-0">
          <p
            className="text-xs font-semibold truncate"
            style={{ color: "var(--text)" }}
          >
            {t.name}
          </p>
          <p
            className="text-xs truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {t.city}
          </p>
        </div>
        <div className="ml-auto flex gap-0.5 shrink-0">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star
              key={i}
              size={10}
              fill="currentColor"
              style={{ color: "#facc15" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
