"use client";

import { Bath, Camera, Car, Coffee, Edit3, Home, ParkingSquare, Plus, Star, Trash2, Wifi, X, Zap } from "lucide-react";
import { useState } from "react";
import type { ElementType } from "react";
import { ProviderCard, ProviderShell, StatusBadge } from "@/components/provider/ProviderShell";
import { chargingSpots } from "@/lib/provider-data";

const amenities = [
  { label: "Covered Area", icon: Home },
  { label: "Security Camera", icon: Camera },
  { label: "Waiting Area", icon: Coffee },
  { label: "Wi-Fi", icon: Wifi },
  { label: "Restroom", icon: Bath },
  { label: "Parking", icon: ParkingSquare },
];

type Spot = (typeof chargingSpots)[number];

export default function SpotsPage() {
  const [spots, setSpots] = useState<Spot[]>(chargingSpots);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [chargerType, setChargerType] = useState<"Fast Charging" | "Slow Charging">("Fast Charging");
  const [isActive, setIsActive] = useState(true);
  const [uploaded, setUploaded] = useState(false);
  const [notice, setNotice] = useState("Tap a station card to view details.");

  const selectedSpot = selectedIndex === null ? null : spots[selectedIndex];
  const editingSpot = editingIndex === null ? null : spots[editingIndex];

  function openEdit(index: number) {
    setEditingIndex(index);
    setSelectedIndex(null);
    setIsActive(spots[index].status === "Active");
    setUploaded(false);
    setNotice(`Editing ${spots[index].name}.`);
  }

  function addNewSpot() {
    const draft: Spot = {
      name: "New Community Charger",
      address: "Enter station address",
      status: "Inactive",
      rating: "New",
      sessions: 0,
      price: "₫40,000/hr",
      slots: "0/1",
      image: "https://picsum.photos/seed/volzen-station-new/640/420",
    };

    setSpots((current) => [draft, ...current]);
    setEditingIndex(0);
    setSelectedIndex(null);
    setIsActive(false);
    setUploaded(false);
    setNotice("New station draft created.");
  }

  function deleteSpot(index: number) {
    const removed = spots[index];
    setSpots((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setSelectedIndex(null);
    setEditingIndex(null);
    setNotice(`${removed.name} deleted.`);
  }

  function saveStation() {
    if (editingIndex === null || !editingSpot) return;

    setSpots((current) =>
      current.map((spot, index) =>
        index === editingIndex
          ? {
              ...spot,
              status: isActive ? "Active" : "Inactive",
              price: chargerType === "Fast Charging" ? "₫55,000/hr" : "₫35,000/hr",
              slots: chargerType === "Fast Charging" ? "1/2" : "2/3",
            }
          : spot,
      ),
    );
    setNotice(`${editingSpot.name} saved.`);
    setEditingIndex(null);
  }

  return (
    <ProviderShell>
      <div className="flex flex-col gap-5">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-700">My Charging Spots</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-4xl">Station management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Create, edit, activate, and monitor every charger listed on Volzen.</p>
          </div>
          <button
            type="button"
            onClick={addNewSpot}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0d1f18] px-5 text-sm font-bold text-white transition active:scale-95 sm:w-auto"
          >
            <Plus size={18} /> Add New Charging Spot
          </button>
        </div>

        <div className="rounded-3xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm shadow-emerald-950/5">
          {notice}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {spots.map((spot, index) => (
            <ProviderCard key={`${spot.name}-${index}`} className="overflow-hidden p-0">
              <button type="button" onClick={() => setSelectedIndex(index)} className="block w-full text-left">
                <img src={spot.image} alt={spot.name} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-bold">{spot.name}</h2>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{spot.address}</p>
                    </div>
                    <StatusBadge tone={spot.status === "Active" ? "green" : "red"}>{spot.status}</StatusBadge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Metric icon={Star} label="Rating" value={spot.rating} />
                    <Metric icon={Zap} label="Sessions" value={String(spot.sessions)} />
                    <Metric icon={Car} label="Price" value={spot.price} />
                    <Metric icon={ParkingSquare} label="Slots" value={spot.slots} />
                  </div>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50 p-3">
                <Action icon={Edit3} label="Edit" onClick={() => openEdit(index)} />
                <Action icon={Trash2} label="Delete" danger onClick={() => deleteSpot(index)} />
              </div>
            </ProviderCard>
          ))}
        </div>

        <ProviderCard>
          <h2 className="font-bold">Station Performance</h2>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {[
              ["Total Revenue", "₫34.8M"],
              ["Occupancy Rate", "78%"],
              ["Average Rating", "4.9"],
              ["Total Sessions", "426"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </ProviderCard>

        {selectedSpot && (
          <SpotModal title="Charging Spot Details" onClose={() => setSelectedIndex(null)}>
            <img src={selectedSpot.image} alt={selectedSpot.name} className="h-44 w-full rounded-3xl object-cover" />
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{selectedSpot.name}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">{selectedSpot.address}</p>
              </div>
              <StatusBadge tone={selectedSpot.status === "Active" ? "green" : "red"}>{selectedSpot.status}</StatusBadge>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric icon={Star} label="Rating" value={selectedSpot.rating} />
              <Metric icon={Zap} label="Sessions" value={String(selectedSpot.sessions)} />
              <Metric icon={Car} label="Price" value={selectedSpot.price} />
              <Metric icon={ParkingSquare} label="Slots" value={selectedSpot.slots} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {amenities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex min-h-12 items-center gap-2 rounded-2xl bg-slate-50 px-3 text-sm font-semibold">
                    <Icon size={16} className="text-emerald-600" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </SpotModal>
        )}

        {editingSpot && (
          <SpotModal title="Edit Charging Spot" onClose={() => setEditingIndex(null)}>
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-bold">Basic Information</p>
                <div className="grid gap-3">
                  <input className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400" placeholder="Station Name" defaultValue={editingSpot.name} />
                  <input className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400" placeholder="Address" defaultValue={editingSpot.address} />
                  <textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400" placeholder="Description" defaultValue="Covered home charger with secure parking and waiting area." />
                  <button
                    type="button"
                    onClick={() => setUploaded(true)}
                    className="h-12 rounded-2xl border border-dashed border-emerald-400 bg-emerald-50 text-sm font-bold text-emerald-700"
                  >
                    {uploaded ? "Images Uploaded" : "Upload Images"}
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold">Charging Information</p>
                <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setChargerType("Fast Charging")}
                    className={`h-12 rounded-2xl text-sm font-bold ${chargerType === "Fast Charging" ? "bg-emerald-500 text-[#0d1f18]" : "bg-slate-100 text-slate-600"}`}
                  >
                    Fast Charging
                  </button>
                  <button
                    type="button"
                    onClick={() => setChargerType("Slow Charging")}
                    className={`h-12 rounded-2xl text-sm font-bold ${chargerType === "Slow Charging" ? "bg-emerald-500 text-[#0d1f18]" : "bg-slate-100 text-slate-600"}`}
                  >
                    Slow Charging
                  </button>
                  <input className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400" type="number" placeholder="Slots" defaultValue={3} />
                  <input className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400" placeholder="Price / Hour" defaultValue="42000" />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold">Amenities</p>
                <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                  {amenities.map((item) => {
                    const Icon = item.icon;
                    return (
                      <label key={item.label} className="flex min-h-12 items-center gap-2 rounded-2xl bg-slate-50 px-3 text-sm font-semibold">
                        <input type="checkbox" defaultChecked className="accent-emerald-500" />
                        <Icon size={16} className="text-emerald-600" />
                        {item.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-3xl bg-emerald-50 p-4">
                <div>
                  <p className="font-bold">Station Status</p>
                  <p className="text-sm text-emerald-800/70">Active stations are bookable by drivers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive((current) => !current)}
                  className={`h-8 w-14 rounded-full p-1 transition ${isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                  aria-pressed={isActive}
                >
                  <span className={`block size-6 rounded-full bg-white shadow-sm transition ${isActive ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              <button type="button" onClick={saveStation} className="h-12 w-full rounded-2xl bg-[#0d1f18] text-sm font-bold text-white transition active:scale-95">
                Save Station
              </button>
            </div>
          </SpotModal>
        )}
      </div>
    </ProviderShell>
  );
}

function SpotModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/30 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl shadow-slate-950/20">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Charging Spot</p>
            <h2 className="mt-1 text-xl font-bold">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-slate-100">
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <Icon size={15} className="text-emerald-600" />
      <p className="mt-2 text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-xs font-bold sm:text-sm">{value}</p>
    </div>
  );
}

function Action({ icon: Icon, label, danger = false, onClick }: { icon: ElementType; label: string; danger?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-11 items-center justify-center gap-1.5 rounded-2xl text-xs font-bold transition active:scale-95 ${danger ? "bg-red-50 text-red-700" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>
      <Icon size={14} />
      {label}
    </button>
  );
}
