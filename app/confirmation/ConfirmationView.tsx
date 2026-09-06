"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import StatusBadge from "@/components/StatusBadge";

const DELIVERY_FEE_NGN = 1500;

function formatNGN(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function monthsBetween(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  return Math.max(1, Math.ceil(days / 30));
}

export default function ConfirmationView() {
  const searchParams = useSearchParams();
  const { getBookingByReference, getPackageById } = useStore();
  const [refInput, setRefInput] = useState(searchParams.get("ref") ?? "");
  const ref = searchParams.get("ref") ?? "";
  const booking = ref ? getBookingByReference(ref) : undefined;

  if (!booking) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold text-navy-900">
          Find Your Booking Confirmation
        </h1>
        <p className="mt-2 text-navy-500">
          Enter your booking reference number to view the confirmation
          summary.
        </p>
        <form
          className="mx-auto mt-6 flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `/confirmation?ref=${refInput.trim()}`;
          }}
        >
          <input
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="e.g. SSS-24081"
            className="flex-1 rounded-xl border border-navy-200 px-4 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
          <button className="rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-900">
            Find
          </button>
        </form>
      </div>
    );
  }

  const pkg = getPackageById(booking.packageId);
  const months = monthsBetween(booking.startDate, booking.expectedPickupDate);
  const storageCost = (pkg?.priceNGN ?? 0) * months;
  const deliveryCost = booking.pickupDeliveryAddOn ? DELIVERY_FEE_NGN : 0;
  const total = storageCost + deliveryCost;

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 animate-check-pop">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#207d74"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-navy-900">
          Booking Confirmed!
        </h1>
        <p className="mt-2 text-navy-500">
          Your storage reference number is
        </p>
        <p className="mt-1 text-2xl font-black tracking-wide text-amber-600">
          {booking.referenceNumber}
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft sm:p-8" id="print-area">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Student
            </p>
            <p className="text-base font-bold text-navy-900">
              {booking.studentName}
            </p>
            <p className="text-sm text-navy-500">
              {booking.regNumber} · {booking.phone}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Package
            </p>
            <p className="text-sm font-medium text-navy-800">{pkg?.name}</p>
            <p className="text-xs text-navy-400">{pkg?.sizeDescription}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Accommodation
            </p>
            <p className="text-sm font-medium text-navy-800">
              {booking.accommodationType}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Storage Start
            </p>
            <p className="text-sm font-medium text-navy-800">
              {formatDate(booking.startDate)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Expected Pickup
            </p>
            <p className="text-sm font-medium text-navy-800">
              {formatDate(booking.expectedPickupDate)}
            </p>
          </div>
          {booking.pickupDeliveryAddOn && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                Delivery Address
              </p>
              <p className="text-sm font-medium text-navy-800">
                {booking.deliveryAddress}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
            Registered Inventory ({booking.items.length} item
            {booking.items.length === 1 ? "" : "s"})
          </p>
          {booking.items.length === 0 ? (
            <p className="mt-2 text-sm text-navy-400">
              No items registered yet.{" "}
              <Link
                href={`/inventory?ref=${booking.referenceNumber}`}
                className="font-medium text-amber-600 underline"
              >
                Register items now
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-navy-100 rounded-xl border border-navy-100">
              {booking.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <span className="font-medium text-navy-800">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-xs text-navy-400">
                    {item.category}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 space-y-1.5 border-t border-navy-100 pt-5 text-sm">
          <div className="flex justify-between text-navy-600">
            <span>
              {pkg?.name} × {months} month{months > 1 ? "s" : ""}
            </span>
            <span>{formatNGN(storageCost)}</span>
          </div>
          {booking.pickupDeliveryAddOn && (
            <div className="flex justify-between text-navy-600">
              <span>Pickup & delivery service</span>
              <span>{formatNGN(deliveryCost)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-navy-100 pt-2 text-base font-bold text-navy-900">
            <span>Estimated Total</span>
            <span>{formatNGN(total)}</span>
          </div>
          <p className="text-xs text-navy-400">
            Illustrative pricing, subject to market research. No payment has
            been collected in this prototype.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy-100 bg-navy-50/60 p-6">
          <h2 className="font-bold text-navy-900">What Happens Next</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-navy-600">
            <li>Bring your items to the drop-off point (or wait for pickup, if selected) on your start date.</li>
            <li>Our team verifies your inventory list against what you bring.</li>
            <li>You'll receive a storage confirmation tag for your items.</li>
            <li>Request pickup any time from the Pickup / Status page using your reference number.</li>
          </ol>
        </div>
        <div className="flex flex-col gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="rounded-xl border border-navy-800 px-5 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50"
          >
            🖨️ Print / Save Confirmation
          </button>
          <Link
            href={`/pickup?ref=${booking.referenceNumber}`}
            className="rounded-xl bg-navy-800 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-navy-900"
          >
            Manage Pickup / Status
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-navy-200 px-5 py-3 text-center text-sm font-medium text-navy-600 hover:bg-navy-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
