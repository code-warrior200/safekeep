"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PickupManager() {
  const searchParams = useSearchParams();
  const { getBookingByReference, getPackageById, updateBookingStatus } =
    useStore();

  const [refInput, setRefInput] = useState(searchParams.get("ref") ?? "");
  const [lookedUpRef, setLookedUpRef] = useState(searchParams.get("ref") ?? "");
  const [lookupError, setLookupError] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [wantsDelivery, setWantsDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(false);

  const booking = lookedUpRef ? getBookingByReference(lookedUpRef) : undefined;
  const pkg = booking ? getPackageById(booking.packageId) : undefined;

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const found = getBookingByReference(refInput);
    if (!found) {
      setLookupError("No booking found with that reference number.");
      setLookedUpRef("");
      return;
    }
    setLookupError("");
    setLookedUpRef(refInput.trim());
    setWantsDelivery(found.pickupDeliveryAddOn);
    setDeliveryAddress(found.deliveryAddress ?? "");
    setPickupDate(found.expectedPickupDate);
  }

  function handleRequestPickup(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;
    if (!pickupDate) {
      setFormError("Please choose a pickup/delivery date.");
      return;
    }
    if (wantsDelivery && !deliveryAddress.trim()) {
      setFormError("Please enter a delivery address.");
      return;
    }
    setFormError("");
    updateBookingStatus(booking.referenceNumber, "Pickup Scheduled", {
      expectedPickupDate: pickupDate,
      deliveryAddress: wantsDelivery ? deliveryAddress.trim() : undefined,
    });
    setToast(true);
  }

  function markReturned() {
    if (!booking) return;
    updateBookingStatus(booking.referenceNumber, "Returned");
    setToast(true);
  }

  if (!booking) {
    return (
      <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft sm:p-8">
        <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="Enter booking reference, e.g. SSS-24102"
            className="flex-1 rounded-xl border border-navy-200 px-4 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
          <button
            type="submit"
            className="rounded-xl bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-900"
          >
            Look Up
          </button>
        </form>
        {lookupError && (
          <p className="mt-3 text-sm text-red-500">{lookupError}</p>
        )}
        <p className="mt-4 text-xs text-navy-400">
          Try seeded demo references: <strong>SSS-24081</strong> or{" "}
          <strong>SSS-24102</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              {booking.referenceNumber}
            </p>
            <p className="text-lg font-bold text-navy-900">
              {booking.studentName}
            </p>
            <p className="text-sm text-navy-500">{pkg?.name}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-navy-400">Storage Start</dt>
            <dd className="font-medium text-navy-800">
              {formatDate(booking.startDate)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-navy-400">Expected Pickup</dt>
            <dd className="font-medium text-navy-800">
              {formatDate(booking.expectedPickupDate)}
            </dd>
          </div>
        </dl>
      </div>

      {booking.status !== "Returned" ? (
        <form
          onSubmit={handleRequestPickup}
          className="space-y-5 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft"
        >
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber-600">
            Request Pickup / Delivery
          </h2>

          <label className="block text-sm font-medium text-navy-700">
            Requested Pickup/Delivery Date
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-navy-100 bg-navy-50/60 px-4 py-3.5">
            <span className="text-sm font-medium text-navy-700">
              I'd like this delivered to me instead of picking it up myself
            </span>
            <input
              type="checkbox"
              checked={wantsDelivery}
              onChange={(e) => setWantsDelivery(e.target.checked)}
              className="h-5 w-5 rounded border-navy-300 text-amber-500 focus:ring-amber-400"
            />
          </label>

          {wantsDelivery && (
            <label className="block text-sm font-medium text-navy-700">
              Delivery Address
              <input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Amina Hostel, Room C3, ABU Main Campus"
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
              />
            </label>
          )}

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-soft hover:bg-amber-400"
          >
            Confirm Pickup Request
          </button>

          {booking.status === "Pickup Scheduled" && (
            <button
              type="button"
              onClick={markReturned}
              className="w-full rounded-xl border border-navy-200 px-6 py-3 text-sm font-medium text-navy-600 hover:bg-navy-50"
            >
              Mark as Returned (operator action)
            </button>
          )}
        </form>
      ) : (
        <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-6 text-center">
          <p className="font-semibold text-teal-800">
            This booking has been marked as Returned. All items were handed
            back to the student.
          </p>
        </div>
      )}

      <Toast
        message="Pickup status updated."
        show={toast}
        onClose={() => setToast(false)}
      />
    </div>
  );
}
