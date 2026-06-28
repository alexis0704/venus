import {
  providerSummary as mockProviderSummary,
  revenueTimeSeries as mockRevenueTimeSeries,
  monthlyRevenue as mockMonthlyRevenue,
  weeklyRevenue as mockWeeklyRevenue,
  occupancyRevenue as mockOccupancyRevenue,
  revenueBreakdown as mockRevenueBreakdown,
  transactions as mockTransactions,
  bookingSlots as mockBookingSlots,
  bookingHeatmapData as mockBookingHeatmapData,
  slotDistribution as mockSlotDistribution,
  chargingSpots as mockChargingSpots,
  stationPerformance as mockStationPerformance,
} from "@/lib/provider-data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const API_V1 = `${API_BASE}/api/v1`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_V1}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────

type ApiOrder = {
  id: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  total: number;
  status: string;
  driver: { id: string; fullName: string; avatarUrl: string | null };
  vehicle: { brand: string; model: string; connectorType: string; plate: string | null; batteryPercent: number | null };
};

type ApiOrdersResponse = {
  total: number;
  orders: ApiOrder[];
};

type ApiAnalyticsResponse = {
  summary: { label: string; value: number; delta: string | null }[];
  revenueSeries: number[];
  weeklyRevenue: number[];
  occupancyRevenue: { day: string; occupancy: number; revenue: number }[];
  transactions: { date: string; driverName: string; vehicle: string; durationHours: number; amount: number; status: string }[];
};

type ApiStationResponse = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  pricePerHour: number;
  connectorTypes: string[];
  amenities: string[];
  photoUrls: string[];
  isAvailable: boolean;
  status: string;
};

type ApiBlockedSlotResponse = {
  id: string;
  startTime: string;
  endTime: string;
  reason: string;
};

type ApiUpdateStatusRequest = { status: string };
type ApiUpsertStationRequest = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  pricePerHour: number;
  connectorTypes: string[];
  amenities: string[];
  photoUrls: string[];
  isAvailable: boolean;
};

// ── Helpers ────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function formatVND(v: number) {
  return `₫${v.toLocaleString("vi-VN")}`;
}

function formatDuration(hours: number) {
  if (hours === Math.floor(hours)) return `${hours}h`;
  return `${hours.toFixed(1).replace(".5", ".5").replace(/\.0$/, "")}h`;
}

function mapStatus(status: string) {
  if (status === "paid" || status === "completed") return "Paid";
  if (status === "pending" || status === "confirmed" || status === "active") return "Pending";
  return "Pending";
}

function statusBadgeTone(status: string) {
  if (status === "Paid" || status === "completed") return "green" as const;
  return "orange" as const;
}

// ── Host API Functions ─────────────────────────────

export async function getMyStation(): Promise<ApiStationResponse | null> {
  try {
    return await request<ApiStationResponse>("/me/station");
  } catch {
    return null;
  }
}

export async function upsertMyStation(data: ApiUpsertStationRequest): Promise<ApiStationResponse | null> {
  try {
    return await request<ApiStationResponse>("/me/station", { method: "PUT", body: JSON.stringify(data) });
  } catch {
    return null;
  }
}

export async function getHostOrders(params?: { status?: string; limit?: number; offset?: number }): Promise<ApiOrdersResponse | null> {
  try {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    if (params?.offset !== undefined) query.set("offset", String(params.offset));
    const qs = query.toString();
    return await request<ApiOrdersResponse>(`/me/station/orders${qs ? `?${qs}` : ""}`);
  } catch {
    return null;
  }
}

export async function updateHostOrderStatus(orderId: string, status: string): Promise<{ id: string; status: string } | null> {
  try {
    return await request<{ id: string; status: string }>(`/me/station/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status } satisfies ApiUpdateStatusRequest),
    });
  } catch {
    return null;
  }
}

export async function createBlockedSlot(data: { startTime: string; endTime: string; reason: string }): Promise<ApiBlockedSlotResponse | null> {
  try {
    return await request<ApiBlockedSlotResponse>("/me/station/blocked-slots", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return null;
  }
}

export async function deleteBlockedSlot(blockId: string): Promise<boolean> {
  try {
    await request<void>(`/me/station/blocked-slots/${blockId}`, { method: "DELETE" });
    return true;
  } catch {
    return false;
  }
}

export async function getHostAnalytics(year?: number): Promise<ApiAnalyticsResponse | null> {
  try {
    const qs = year ? `?year=${year}` : "";
    return await request<ApiAnalyticsResponse>(`/me/station/analytics${qs}`);
  } catch {
    return null;
  }
}

export async function verifyProviderLicence(file: File): Promise<{ verified: boolean; message: string } | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_V1}/me/provider/verify-licence`, { method: "POST", body: formData });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

// ── Financial Dashboard Data Fetcher ────────────────

export type ProviderSummaryItem = { label: string; value: string; delta: string };
export type TimeSeriesItem = { day: string; revenue: number; sessions: number };
export type MonthlyRevenueItem = { month: string; revenue: number; sessions: number };
export type WeeklyRevenueItem = { day: string; revenue: number; sessions: number };
export type OccupancyRevenueItem = { day: string; occupancy: number; revenue: number };
export type RevenueBreakdownItem = { name: string; value: number; color: string; fill: string };
export type TransactionItem = { date: string; driver: string; vehicle: string; duration: string; amount: string; status: string };

export type FinancialData = {
  providerSummary: ProviderSummaryItem[];
  revenueTimeSeries: TimeSeriesItem[];
  monthlyRevenue: MonthlyRevenueItem[];
  weeklyRevenue: WeeklyRevenueItem[];
  occupancyRevenue: OccupancyRevenueItem[];
  revenueBreakdown: RevenueBreakdownItem[];
  transactions: TransactionItem[];
};

function generateRevenueTimeSeries(): TimeSeriesItem[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const day = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const revenue = Math.round(10000 + Math.random() * 80000);
    const sessions = Math.round(1 + Math.random() * 5);
    return { day, revenue, sessions };
  });
}

export async function fetchFinancialData(): Promise<FinancialData> {
  const api = await getHostAnalytics();
  if (!api) {
    return {
      providerSummary: mockProviderSummary as ProviderSummaryItem[],
      revenueTimeSeries: mockRevenueTimeSeries as TimeSeriesItem[],
      monthlyRevenue: mockMonthlyRevenue as MonthlyRevenueItem[],
      weeklyRevenue: mockWeeklyRevenue as WeeklyRevenueItem[],
      occupancyRevenue: mockOccupancyRevenue as OccupancyRevenueItem[],
      revenueBreakdown: mockRevenueBreakdown as RevenueBreakdownItem[],
      transactions: mockTransactions as TransactionItem[],
    };
  }

  const providerSummary: ProviderSummaryItem[] = api.summary.map((s) => ({
    label: s.label,
    value: s.label.toLowerCase().includes("revenue")
      ? formatVND(s.value)
      : String(s.value),
    delta: s.delta ?? (s.label === "Pending Payout" ? "Ready" : ""),
  }));

  const monthlyRevenue: MonthlyRevenueItem[] = api.revenueSeries.map((revenue, i) => ({
    month: MONTHS[i] ?? `M${i + 1}`,
    revenue,
    sessions: 0,
  }));

  const weeklyRevenue: WeeklyRevenueItem[] = api.weeklyRevenue.map((revenue, i) => ({
    day: DAYS[i] ?? `day${i}`,
    revenue,
    sessions: 0,
  }));

  const occupancyRevenue = api.occupancyRevenue as OccupancyRevenueItem[];

  const transactions: TransactionItem[] = api.transactions.map((tx) => ({
    date: new Date(tx.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    driver: tx.driverName,
    vehicle: tx.vehicle,
    duration: formatDuration(tx.durationHours),
    amount: formatVND(tx.amount),
    status: mapStatus(tx.status),
  }));

  return {
    providerSummary,
    revenueTimeSeries: generateRevenueTimeSeries(),
    monthlyRevenue,
    weeklyRevenue,
    occupancyRevenue,
    revenueBreakdown: mockRevenueBreakdown as RevenueBreakdownItem[],
    transactions,
  };
}

// ── Bookings Data Fetcher ──────────────────────────

export type BookingSlot = {
  id: string;
  time: string;
  end: string;
  title: string;
  state: string;
  vehicle: string;
  plate: string;
  battery: string;
  cost: string;
};

export type BookingHeatmapEntry = { day: string; hour: string; bookings: number };
export type SlotDistributionEntry = { name: string; value: number; color: string; fill: string };

export type BookingsData = {
  slots: BookingSlot[];
  heatmapData: BookingHeatmapEntry[];
  slotDistribution: SlotDistributionEntry[];
};

function ordersToBookingSlots(orders: ApiOrder[]): BookingSlot[] {
  const HOURS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const now = new Date();
  const occupied: BookingSlot[] = orders.slice(0, 5).map((order) => {
    const start = order.startTime.slice(11, 16);
    const end = order.endTime.slice(11, 16);
    const state = getBookingSlotState(order, now);
    return {
      id: order.id,
      time: start,
      end,
      title: order.driver.fullName,
      state,
      vehicle: `${order.vehicle.brand} ${order.vehicle.model}`,
      plate: "",
      battery: "",
      cost: formatVND(order.total),
    };
  });
  const usedTimes = new Set(occupied.map((s) => s.time));
  const available: BookingSlot[] = HOURS.filter((h) => !usedTimes.has(h)).map((h) => ({
    id: `open-${h}`,
    time: h,
    end: `${String(Number(h.split(":")[0]) + 2).padStart(2, "0")}:00`,
    title: "Open slot",
    state: "Available",
    vehicle: "",
    plate: "",
    battery: "",
    cost: "",
  }));
  return [...occupied, ...available].sort((a, b) => a.time.localeCompare(b.time));
}

function getBookingSlotState(order: ApiOrder, now: Date): string {
  const status = order.status.toLowerCase();
  if (status === "cancelled") return "Available";
  if (status === "completed") return "Completed";
  if (status === "active") {
    const startTime = new Date(order.startTime);
    const endTime = new Date(order.endTime);
    if (now >= startTime && now < endTime) return "Charging";
    return now < startTime ? "Booked" : "Completed";
  }
  return "Booked";
}

export async function fetchBookingsData(): Promise<BookingsData> {
  const [ordersRes] = await Promise.all([getHostOrders({ limit: 20 })]);
  if (!ordersRes || ordersRes.orders.length === 0) {
    return {
      slots: mockBookingSlots as BookingSlot[],
      heatmapData: (mockBookingHeatmapData as { day: string; hours: { h: string; bookings: number }[] }[]).flatMap((d) =>
        d.hours.map((h) => ({ day: d.day, hour: h.h, bookings: h.bookings }))
      ),
      slotDistribution: mockSlotDistribution as SlotDistributionEntry[],
    };
  }

  return {
    slots: ordersToBookingSlots(ordersRes.orders),
    heatmapData: (mockBookingHeatmapData as { day: string; hours: { h: string; bookings: number }[] }[]).flatMap((d) =>
      d.hours.map((h) => ({ day: d.day, hour: h.h, bookings: h.bookings }))
    ),
    slotDistribution: mockSlotDistribution as SlotDistributionEntry[],
  };
}

// ── Spots Data Fetcher ─────────────────────────────

export type ChargingSpot = {
  name: string;
  address: string;
  status: string;
  rating: string;
  sessions: number;
  price: string;
  slots: string;
  image: string;
};

export type StationPerformanceEntry = {
  name: string;
  revenue: number;
  sessions: number;
  rating: number;
  occupancy: number;
};

export type SpotsData = {
  spots: ChargingSpot[];
  stationPerformance: StationPerformanceEntry[];
};

export async function fetchSpotsData(): Promise<SpotsData> {
  const station = await getMyStation();
  if (!station) {
    return {
      spots: mockChargingSpots as ChargingSpot[],
      stationPerformance: mockStationPerformance as StationPerformanceEntry[],
    };
  }

  return {
    spots: [
      {
        name: station.name,
        address: station.address,
        status: station.isAvailable ? "Active" : "Inactive",
        rating: "4.9",
        sessions: 186,
        price: formatVND(station.pricePerHour) + "/hr",
        slots: `${station.connectorTypes.length}/4`,
        image: station.photoUrls[0] ?? "/stations/pvd-p1-1.svg",
      } as ChargingSpot,
      ...(mockChargingSpots as ChargingSpot[]).slice(1),
    ],
    stationPerformance: mockStationPerformance as StationPerformanceEntry[],
  };
}
