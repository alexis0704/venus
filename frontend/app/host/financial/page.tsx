"use client";

import { ArrowDownToLine, CalendarDays, CreditCard, TrendingUp, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { ProviderCard, ProviderShell, StatusBadge } from "@/components/provider/ProviderShell";
import { occupancyRevenue, providerSummary, revenueSeries, transactions, weeklyRevenue } from "@/lib/provider-data";

const filters = ["Today", "This Week", "This Month", "This Year"];

export default function FinancialDashboardPage() {
  const [activeFilter, setActiveFilter] = useState("This Month");
  const [selectedTx, setSelectedTx] = useState<(typeof transactions)[number] | null>(null);
  const [notice, setNotice] = useState("Showing this month's provider performance.");
  const multiplier = filters.indexOf(activeFilter) + 1;
  const adjustedSeries = useMemo(() => revenueSeries.map((value) => Math.max(24, value - 8 + multiplier * 4)), [multiplier]);
  const points = adjustedSeries.map((value, index) => `${index * 9},${120 - value}`).join(" ");

  function handleWithdraw() {
    setNotice("Withdrawal request created for ₫7.2M. Payout status is now pending.");
  }

  return (
    <ProviderShell>
      <div className="flex flex-col gap-5">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-700">Financial Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-4xl">Earnings overview</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Monitor revenue, payouts, station performance, and charging business trends.</p>
          </div>
          <div className="grid w-full grid-cols-4 gap-1 rounded-2xl bg-white p-1 ring-1 ring-emerald-900/10 sm:w-auto sm:gap-2 sm:bg-transparent sm:p-0 sm:ring-0">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter);
                  setNotice(`Revenue analytics updated for ${filter.toLowerCase()}.`);
                }}
                className={`h-9 rounded-xl px-1 text-[11px] font-semibold transition active:scale-95 sm:h-11 sm:rounded-full sm:px-4 sm:text-sm ${activeFilter === filter ? "bg-[#0d1f18] text-white" : "text-slate-600 sm:bg-white sm:ring-1 sm:ring-emerald-900/10"}`}
              >
                <span className="sm:hidden">{filter.replace("This ", "").replace("Today", "Day")}</span>
                <span className="hidden sm:inline">{filter}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm shadow-emerald-950/5">
          {notice}
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {providerSummary.map((item) => (
            <ProviderCard key={item.label}>
              <p className="text-xs leading-4 text-slate-500 sm:text-sm">{item.label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-xl font-bold tracking-tight sm:text-2xl">{item.value}</p>
                <StatusBadge tone={item.delta === "Ready" ? "orange" : "green"}>{item.delta}</StatusBadge>
              </div>
            </ProviderCard>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <ProviderCard>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Revenue Analytics</h2>
                <p className="text-sm text-slate-500">Daily earnings trend</p>
              </div>
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <div className="h-52 rounded-3xl bg-gradient-to-b from-emerald-50 to-white p-4 sm:h-64">
              <svg viewBox="0 0 100 130" className="h-full w-full overflow-visible" preserveAspectRatio="none" aria-label="Daily revenue line chart">
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline points={`0,125 ${points} 99,125`} fill="url(#revenueFill)" stroke="none" />
                <polyline points={points} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </ProviderCard>

          <ProviderCard>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Weekly Revenue</h2>
                <p className="text-sm text-slate-500">Bar chart by day</p>
              </div>
              <CalendarDays size={20} className="text-emerald-600" />
            </div>
            <div className="flex h-52 items-end gap-2 rounded-3xl bg-slate-50 p-3 sm:h-64 sm:gap-3 sm:p-4">
              {weeklyRevenue.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-emerald-500" style={{ height: `${value}px` }} />
                  <span className="text-xs font-medium text-slate-400">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
                </div>
              ))}
            </div>
          </ProviderCard>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ProviderCard>
            <h2 className="font-bold">Occupancy vs Revenue</h2>
            <div className="mt-5 flex flex-col gap-4">
              {occupancyRevenue.map((item) => (
                <div key={item.day} className="grid grid-cols-[36px_1fr] items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">{item.day}</span>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.occupancy}%` }} /></div>
                    <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-900" style={{ width: `${item.revenue}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </ProviderCard>

          <ProviderCard>
            <h2 className="font-bold">Revenue Breakdown</h2>
            <div className="mt-5 space-y-4">
              {[
                ["Charging Revenue", "₫21.4M"],
                ["Platform Fees", "-₫2.7M"],
                ["Net Earnings", "₫18.7M"],
                ["Avg. Revenue / Session", "₫74,200"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
          </ProviderCard>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
          <ProviderCard>
            <h2 className="font-bold">Transaction History</h2>
            <div className="mt-4 space-y-3 lg:hidden">
              {transactions.map((tx) => (
                <TransactionCard
                  key={`${tx.date}-${tx.driver}`}
                  tx={tx}
                  onSelect={() => {
                    setSelectedTx(tx);
                    setNotice(`Selected ${tx.driver}'s ${tx.amount} transaction.`);
                  }}
                />
              ))}
            </div>
            <div className="mt-4 hidden overflow-x-auto rounded-3xl border border-slate-100 lg:block">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>{["Date", "Driver", "Vehicle", "Duration", "Amount", "Status"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={`${tx.date}-${tx.driver}`}
                      onClick={() => {
                        setSelectedTx(tx);
                        setNotice(`Selected ${tx.driver}'s ${tx.amount} transaction.`);
                      }}
                      className="cursor-pointer border-t border-slate-100 transition hover:bg-emerald-50/50"
                    >
                      <td className="px-4 py-4">{tx.date}</td>
                      <td className="px-4 py-4 font-semibold">{tx.driver}</td>
                      <td className="px-4 py-4 text-slate-500">{tx.vehicle}</td>
                      <td className="px-4 py-4 text-slate-500">{tx.duration}</td>
                      <td className="px-4 py-4 font-bold">{tx.amount}</td>
                      <td className="px-4 py-4"><StatusBadge tone={tx.status === "Paid" ? "green" : "orange"}>{tx.status}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ProviderCard>

          <ProviderCard>
            <Wallet className="text-emerald-600" />
            <h2 className="mt-4 font-bold">Payout</h2>
            <p className="mt-1 text-sm text-slate-500">Available Balance</p>
            <p className="mt-3 text-4xl font-bold">₫7.2M</p>
            <div className="mt-5 rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Connected Bank</p>
              <p className="mt-1 font-semibold">Vietcombank •••• 8821</p>
            </div>
            <button
              type="button"
              onClick={handleWithdraw}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 font-bold text-[#0d1f18] transition active:scale-95"
            >
              <ArrowDownToLine size={18} /> Withdraw
            </button>
          </ProviderCard>
        </div>

        {selectedTx && (
          <div className="fixed inset-x-3 bottom-[88px] z-50 max-h-[62dvh] overflow-y-auto rounded-[28px] border border-emerald-900/10 bg-white p-4 shadow-2xl shadow-emerald-950/15 lg:left-auto lg:right-6 lg:w-96">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Transaction selected</p>
                <h3 className="mt-1 text-lg font-bold">{selectedTx.driver}</h3>
              </div>
              <button type="button" onClick={() => setSelectedTx(null)} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold">Close</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Info label="Date" value={selectedTx.date} />
              <Info label="Amount" value={selectedTx.amount} />
              <Info label="Vehicle" value={selectedTx.vehicle} />
              <Info label="Duration" value={selectedTx.duration} />
            </div>
          </div>
        )}
      </div>
    </ProviderShell>
  );
}

function TransactionCard({ tx, onSelect }: { tx: (typeof transactions)[number]; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className="w-full rounded-3xl bg-slate-50 p-4 text-left transition active:scale-[0.99]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">{tx.driver}</p>
          <p className="text-sm text-slate-500">{tx.date} · {tx.vehicle}</p>
        </div>
        <StatusBadge tone={tx.status === "Paid" ? "green" : "orange"}>{tx.status}</StatusBadge>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-slate-500"><CreditCard size={15} /> {tx.duration}</span>
        <span className="font-bold">{tx.amount}</span>
      </div>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
