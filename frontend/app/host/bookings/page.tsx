"use client";

import { useState } from "react";
import type { ElementType } from "react";
import { BatteryCharging, CalendarDays, Car, Clock, X, UserRound, Zap } from "lucide-react";
import { ProviderCard, ProviderShell, StatusBadge } from "@/components/provider/ProviderShell";
import { bookingSlots, heatmapDemand } from "@/lib/provider-data";

const slotStyles: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-800 ring-emerald-500/20",
  Booked: "bg-sky-50 text-sky-800 ring-sky-500/20",
  Blocked: "bg-slate-100 text-slate-600 ring-slate-400/20",
  Charging: "bg-orange-50 text-orange-800 ring-orange-500/20",
  Completed: "bg-slate-50 text-slate-500 ring-slate-300/30",
};

export default function BookingsPage() {
  const [slots, setSlots] = useState(bookingSlots);
  const [selected, setSelected] = useState<(typeof bookingSlots)[number] | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [notice, setNotice] = useState("Calendar loaded for Nguyen Hue Home Charger.");

  function updateSelectedState(state: string) {
    if (!selected) return;
    const updated = { ...selected, state };
    setSlots((current) => current.map((slot) => (slot.id === selected.id ? updated : slot)));
    setSelected(updated);
    setNotice(`${selected.title} marked as ${state.toLowerCase()}.`);
  }

  function saveBlockTime() {
    const blockedSlot = {
      id: `blocked-${Date.now()}`,
      time: "14:00",
      end: "15:00",
      title: "Personal block",
      state: "Blocked",
      vehicle: "",
      plate: "",
      battery: "",
      cost: "",
    };

    setSlots((current) => [...current.filter((slot) => slot.time !== "14:00"), blockedSlot]);
    setSelected(blockedSlot);
    setShowBlockModal(false);
    setNotice("Blocked 2 PM - 3 PM for Nguyen Hue Home Charger.");
  }

  return (
    <ProviderShell>
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-700">Booking Calendar</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-4xl">Schedule management</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Manage reservations, station availability, blocked hours, and demand patterns.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
              <select className="h-11 min-w-0 rounded-2xl border border-emerald-900/10 bg-white px-3 text-sm font-semibold outline-none">
                <option>Nguyen Hue Home Charger</option>
                <option>District 3 Fast Bay</option>
              </select>
              <input type="date" className="h-11 min-w-0 rounded-2xl border border-emerald-900/10 bg-white px-3 text-sm font-semibold outline-none" defaultValue="2026-06-28" />
              <button
                type="button"
                onClick={() => setShowBlockModal(true)}
                className="h-11 rounded-2xl bg-[#0d1f18] px-5 text-sm font-bold text-white transition active:scale-95"
              >
                Block Time
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm shadow-emerald-950/5">
            {notice}
          </div>

          <ProviderCard>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Daily Timeline</h2>
                <p className="text-sm text-slate-500">Tap a booked slot for details</p>
              </div>
              <StatusBadge tone="green">Live</StatusBadge>
            </div>
            <div className="space-y-3 sm:hidden">
              {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((hour) => {
                const slot = slots.find((item) => item.time === hour);
                return <TimelineSlot key={hour} hour={hour} slot={slot} onSelect={(item) => {
                  setSelected(item);
                  setNotice(`${item.time} slot selected.`);
                }} compact />;
              })}
            </div>

            <div className="hidden overflow-auto pb-2 sm:block">
              <div className="min-w-[720px] space-y-3">
                {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((hour) => {
                  const slot = slots.find((item) => item.time === hour);
                  return <TimelineSlot key={hour} hour={hour} slot={slot} onSelect={(item) => {
                    setSelected(item);
                    setNotice(`${item.time} slot selected.`);
                  }} />;
                })}
              </div>
            </div>
          </ProviderCard>

          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_0.85fr]">
            <ProviderCard>
              <h2 className="font-bold">Monthly Booking Heatmap</h2>
              <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
                {heatmapDemand.map((level, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl"
                    title={`Day ${index + 1}`}
                    style={{
                      background: ["#dcfce7", "#bbf7d0", "#4ade80", "#15803d"][level - 1],
                    }}
                  />
                ))}
              </div>
            </ProviderCard>

            <ProviderCard>
              <h2 className="font-bold">Insights</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Occupancy Rate", "78%"],
                  ["Peak Hours", "5-8 PM"],
                  ["Busiest Day", "Friday"],
                  ["Bookings", "128"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </ProviderCard>
          </div>
        </div>

        <aside className="hidden xl:block">
          {selected ? (
            <BookingDetails booking={selected} onClose={() => setSelected(null)} onAction={updateSelectedState} />
          ) : (
            <ProviderCard className="sticky top-24">
              <p className="text-sm font-semibold text-emerald-700">Booking Details</p>
              <h2 className="mt-2 text-xl font-bold">Select a time slot</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Click any booked, charging, completed, or blocked slot to manage the reservation.</p>
            </ProviderCard>
          )}
        </aside>

        {selected && (
          <div className="fixed inset-x-0 bottom-[84px] z-40 px-3 xl:hidden">
            <BookingDetails booking={selected} compact onClose={() => setSelected(null)} onAction={updateSelectedState} />
          </div>
        )}

        {showBlockModal && (
          <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/30 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
            <div className="max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl shadow-slate-950/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Block Time</p>
                  <h2 className="mt-1 text-xl font-bold">Create unavailable slot</h2>
                </div>
                <button type="button" onClick={() => setShowBlockModal(false)} className="grid size-9 place-items-center rounded-full bg-slate-100">
                  <X size={17} />
                </button>
              </div>
              <div className="mt-5 grid gap-3">
                <select className="h-12 rounded-2xl border border-slate-200 px-3 text-sm font-semibold">
                  <option>Nguyen Hue Home Charger</option>
                  <option>District 3 Fast Bay</option>
                </select>
                <input type="date" defaultValue="2026-06-28" className="h-12 rounded-2xl border border-slate-200 px-3 text-sm font-semibold" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" defaultValue="14:00" className="h-12 rounded-2xl border border-slate-200 px-3 text-sm font-semibold" />
                  <input type="time" defaultValue="15:00" className="h-12 rounded-2xl border border-slate-200 px-3 text-sm font-semibold" />
                </div>
                <select className="h-12 rounded-2xl border border-slate-200 px-3 text-sm font-semibold">
                  <option>Busy</option>
                  <option>Maintenance</option>
                  <option>Personal</option>
                  <option>Other</option>
                </select>
                <button type="button" onClick={saveBlockTime} className="h-12 rounded-2xl bg-[#0d1f18] text-sm font-bold text-white">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProviderShell>
  );
}

function BookingDetails({
  booking,
  compact = false,
  onClose,
  onAction,
}: {
  booking: (typeof bookingSlots)[number];
  compact?: boolean;
  onClose: () => void;
  onAction: (state: string) => void;
}) {
  const disabled = booking.state === "Available" || booking.state === "Blocked";

  return (
    <ProviderCard className={compact ? "max-h-[58dvh] overflow-y-auto rounded-[28px] p-4 shadow-2xl shadow-emerald-950/15" : "sticky top-24"}>
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200 xl:hidden" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Booking Details</p>
          <h2 className="mt-1 text-xl font-bold">{booking.title}</h2>
        </div>
        <StatusBadge tone={booking.state === "Charging" ? "orange" : booking.state === "Booked" ? "blue" : booking.state === "Completed" ? "gray" : booking.state === "Available" ? "green" : "gray"}>
          {booking.state}
        </StatusBadge>
        <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full bg-slate-100 xl:hidden">
          <X size={15} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-sm sm:gap-3">
        <Detail icon={UserRound} label="Driver" value={disabled ? "No driver" : booking.title} />
        <Detail icon={Car} label="Vehicle" value={booking.vehicle || "None"} />
        <Detail icon={Zap} label="Plate" value={booking.plate || "-"} />
        <Detail icon={BatteryCharging} label="Battery" value={booking.battery || "-"} />
        <Detail icon={Clock} label="Duration" value={`${booking.time} - ${booking.end}`} />
        <Detail icon={CalendarDays} label="Cost" value={booking.cost || "-"} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onAction("Booked")} className="h-11 rounded-2xl bg-emerald-500 text-sm font-bold text-[#0d1f18] disabled:opacity-40" disabled={disabled}>Accept</button>
        <button type="button" onClick={() => onAction("Blocked")} className="h-11 rounded-2xl bg-red-50 text-sm font-bold text-red-700 disabled:opacity-40" disabled={disabled}>Reject</button>
        <button type="button" onClick={() => onAction("Charging")} className="h-11 rounded-2xl bg-orange-50 text-sm font-bold text-orange-700 disabled:opacity-40" disabled={disabled}>Mark Charging</button>
        <button type="button" onClick={() => onAction("Completed")} className="h-11 rounded-2xl bg-slate-900 text-sm font-bold text-white disabled:opacity-40" disabled={disabled}>Completed</button>
      </div>
    </ProviderCard>
  );
}

function TimelineSlot({
  hour,
  slot,
  onSelect,
  compact = false,
}: {
  hour: string;
  slot: (typeof bookingSlots)[number] | undefined;
  onSelect: (slot: (typeof bookingSlots)[number]) => void;
  compact?: boolean;
}) {
  const stateClass = slot ? slotStyles[slot.state] : "bg-white text-slate-400 ring-slate-100";

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => slot && onSelect(slot)}
        disabled={!slot}
        className={`grid min-h-[84px] w-full grid-cols-[56px_1fr] items-stretch overflow-hidden rounded-3xl text-left ring-1 transition active:scale-[0.99] disabled:opacity-70 ${stateClass}`}
      >
        <div className="flex items-center justify-center border-r border-current/10 text-sm font-bold">
          {hour}
        </div>
        <div className="flex min-w-0 flex-col justify-center px-4 py-3">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <p className="truncate font-bold">{slot?.title ?? "Open slot"}</p>
            {slot && <span className="shrink-0 rounded-full bg-white/50 px-2 py-0.5 text-[11px] font-bold">{slot.state}</span>}
          </div>
          <p className="mt-1 text-xs opacity-75">{slot ? `${slot.time} - ${slot.end}` : "No booking"}</p>
          {slot?.vehicle && <p className="mt-1 truncate text-xs opacity-75">{slot.vehicle}</p>}
        </div>
      </button>
    );
  }

  return (
    <div className="grid grid-cols-[72px_1fr] items-center gap-3">
      <span className="text-sm font-semibold text-slate-400">{hour}</span>
      <button
        type="button"
        onClick={() => slot && onSelect(slot)}
        disabled={!slot}
        className={`min-h-16 rounded-3xl px-4 text-left ring-1 transition active:scale-[0.99] hover:scale-[1.005] disabled:opacity-70 ${stateClass}`}
      >
        {slot ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-bold">{slot.title}</p>
              <p className="text-xs opacity-75">{slot.time} - {slot.end}</p>
            </div>
            <span className="shrink-0 text-xs font-bold">{slot.state}</span>
          </div>
        ) : (
          <span className="text-sm font-semibold">Open slot</span>
        )}
      </button>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <Icon size={15} className="text-emerald-600" />
      <p className="mt-2 text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 truncate font-bold">{value}</p>
    </div>
  );
}
