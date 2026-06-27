export const providerSummary = [
  { label: "Total Revenue", value: "₫86.4M", delta: "+12.8%" },
  { label: "Revenue This Month", value: "₫18.7M", delta: "+8.4%" },
  { label: "Pending Payout", value: "₫7.2M", delta: "Ready" },
  { label: "Completed Sessions", value: "426", delta: "+31" },
];

export const revenueSeries = [38, 44, 41, 56, 62, 58, 74, 69, 84, 91, 88, 104];
export const weeklyRevenue = [42, 58, 76, 64, 92, 118, 86];
export const occupancyRevenue = [
  { day: "Mon", occupancy: 58, revenue: 45 },
  { day: "Tue", occupancy: 64, revenue: 52 },
  { day: "Wed", occupancy: 71, revenue: 66 },
  { day: "Thu", occupancy: 82, revenue: 78 },
  { day: "Fri", occupancy: 88, revenue: 91 },
  { day: "Sat", occupancy: 76, revenue: 84 },
  { day: "Sun", occupancy: 61, revenue: 59 },
];

export const transactions = [
  { date: "Jun 28", driver: "Lan Anh", vehicle: "VinFast VF8", duration: "2h 10m", amount: "₫92,000", status: "Paid" },
  { date: "Jun 27", driver: "Minh Quan", vehicle: "Tesla Model 3", duration: "1h 45m", amount: "₫74,000", status: "Paid" },
  { date: "Jun 27", driver: "Duc Huy", vehicle: "VinFast VF e34", duration: "3h 00m", amount: "₫126,000", status: "Pending" },
  { date: "Jun 26", driver: "Thu Ha", vehicle: "BYD Atto 3", duration: "1h 20m", amount: "₫58,000", status: "Paid" },
];

export const bookingSlots = [
  { id: "b1", time: "08:00", end: "09:30", title: "Lan Anh", state: "Booked", vehicle: "VinFast VF8", plate: "51F-882.12", battery: "34%", cost: "₫68,000" },
  { id: "b2", time: "10:00", end: "11:00", title: "Available", state: "Available", vehicle: "", plate: "", battery: "", cost: "" },
  { id: "b3", time: "12:00", end: "13:30", title: "Maintenance", state: "Blocked", vehicle: "", plate: "", battery: "", cost: "" },
  { id: "b4", time: "15:00", end: "17:00", title: "Duc Huy", state: "Charging", vehicle: "Tesla Model 3", plate: "30E-771.09", battery: "61%", cost: "₫110,000" },
  { id: "b5", time: "18:00", end: "19:00", title: "Completed", state: "Completed", vehicle: "BYD Atto 3", plate: "51K-120.44", battery: "92%", cost: "₫52,000" },
];

export const heatmapDemand = [
  1, 2, 1, 3, 2, 3, 4, 2, 1, 2, 3, 4, 4, 2, 1, 3, 2, 4, 3, 2, 1, 2, 4, 4, 3, 2, 3, 4, 2, 1,
];

export const chargingSpots = [
  {
    name: "Nguyen Hue Home Charger",
    address: "12 Nguyen Hue, District 1",
    status: "Active",
    rating: "4.9",
    sessions: 186,
    price: "₫42,000/hr",
    slots: "2/3",
    image: "https://picsum.photos/seed/volzen-station-1/640/420",
  },
  {
    name: "District 3 Fast Bay",
    address: "88 Nam Ky Khoi Nghia, District 3",
    status: "Active",
    rating: "4.8",
    sessions: 142,
    price: "₫55,000/hr",
    slots: "1/2",
    image: "https://picsum.photos/seed/volzen-station-2/640/420",
  },
  {
    name: "Weekend Garage Spot",
    address: "45 Le Loi, District 1",
    status: "Inactive",
    rating: "4.6",
    sessions: 98,
    price: "₫35,000/hr",
    slots: "0/1",
    image: "https://picsum.photos/seed/volzen-station-3/640/420",
  },
];
