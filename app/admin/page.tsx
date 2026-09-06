"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import StatusBadge from "@/components/StatusBadge";
import { BookingStatus } from "@/lib/types";

const STATUS_FILTERS: (BookingStatus | "All")[] = [
  "All",
  "In Storage",
  "Pickup Scheduled",
  "Returned",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNGN(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function AdminPage() {
  const { bookings, getPackageById } = useStore();
  const [filter, setFilter] = useState<BookingStatus | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => filter === "All" || b.status === filter)
      .filter((b) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          b.studentName.toLowerCase().includes(q) ||
          b.referenceNumber.toLowerCase().includes(q) ||
          b.regNumber.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [bookings, filter, query]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const inStorage = bookings.filter((b) => b.status === "In Storage").length;
    const scheduled = bookings.filter(
      (b) => b.status === "Pickup Scheduled"
    ).length;
    const revenue = bookings.reduce((sum, b) => {
      const pkg = getPackageById(b.packageId);
      return sum + (pkg?.priceNGN ?? 0);
    }, 0);
    return { total, inStorage, scheduled, revenue };
  }, [bookings, getPackageById]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-navy-900">
            Operator Dashboard
          </h1>
          <p className="mt-2 text-navy-500">
            All bookings at a glance — this is the storage-operator side of
            the two-sided platform.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Bookings" value={stats.total.toString()} />
        <StatCard label="Currently In Storage" value={stats.inStorage.toString()} accent="teal" />
        <StatCard label="Pickup Scheduled" value={stats.scheduled.toString()} accent="amber" />
        <StatCard
          label="Est. Monthly Revenue"
          value={formatNGN(stats.revenue)}
          accent="navy"
        />
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === s
                  ? "bg-navy-800 text-white"
                  : "bg-navy-50 text-navy-600 hover:bg-navy-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, reg. no. or reference..."
          className="rounded-xl border border-navy-200 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100 sm:w-72"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-navy-50/80 text-xs uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">Pickup</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {filtered.map((b) => {
              const pkg = getPackageById(b.packageId);
              return (
                <tr key={b.id} className="hover:bg-navy-50/40">
                  <td className="px-4 py-3 font-semibold text-navy-900">
                    {b.referenceNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-navy-800">
                      {b.studentName}
                    </div>
                    <div className="text-xs text-navy-400">{b.regNumber}</div>
                  </td>
                  <td className="px-4 py-3 text-navy-600">{pkg?.name}</td>
                  <td className="px-4 py-3 text-navy-600">
                    {formatDate(b.startDate)}
                  </td>
                  <td className="px-4 py-3 text-navy-600">
                    {formatDate(b.expectedPickupDate)}
                  </td>
                  <td className="px-4 py-3 text-navy-600">{b.items.length}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/confirmation?ref=${b.referenceNumber}`}
                      className="text-xs font-semibold text-amber-600 hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-navy-400">
                  No bookings match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "navy",
}: {
  label: string;
  value: string;
  accent?: "navy" | "teal" | "amber";
}) {
  const colors = {
    navy: "text-navy-900",
    teal: "text-teal-600",
    amber: "text-amber-600",
  } as const;
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
        {label}
      </p>
      <p className={`mt-1.5 text-2xl font-extrabold ${colors[accent]}`}>
        {value}
      </p>
    </div>
  );
}
