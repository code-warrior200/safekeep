"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { ItemCategory } from "@/lib/types";
import Toast from "@/components/Toast";

const CATEGORIES: ItemCategory[] = [
  "Clothing",
  "Electronics",
  "Books",
  "Mattress/Bedding",
  "Furniture",
  "Other",
];

interface DraftItem {
  key: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  conditionNote: string;
  photoName?: string;
}

function emptyDraft(): DraftItem {
  return {
    key: `draft-${Date.now()}-${Math.random()}`,
    name: "",
    category: "Clothing",
    quantity: 1,
    conditionNote: "",
  };
}

export default function InventoryManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getBookingByReference, getPackageById, addItemsToBooking } =
    useStore();

  const [refInput, setRefInput] = useState(searchParams.get("ref") ?? "");
  const [lookedUpRef, setLookedUpRef] = useState(searchParams.get("ref") ?? "");
  const [lookupError, setLookupError] = useState("");
  const [drafts, setDrafts] = useState<DraftItem[]>([emptyDraft()]);
  const [toast, setToast] = useState(false);

  const booking = lookedUpRef ? getBookingByReference(lookedUpRef) : undefined;
  const pkg = booking ? getPackageById(booking.packageId) : undefined;

  const validDrafts = useMemo(
    () => drafts.filter((d) => d.name.trim().length > 0),
    [drafts]
  );

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!getBookingByReference(refInput)) {
      setLookupError("No booking found with that reference number.");
      setLookedUpRef("");
      return;
    }
    setLookupError("");
    setLookedUpRef(refInput.trim());
  }

  function updateDraft(key: string, patch: Partial<DraftItem>) {
    setDrafts((ds) => ds.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  }

  function removeDraft(key: string) {
    setDrafts((ds) => (ds.length === 1 ? ds : ds.filter((d) => d.key !== key)));
  }

  function addDraftRow() {
    setDrafts((ds) => [...ds, emptyDraft()]);
  }

  function handleSaveItems() {
    if (!booking || validDrafts.length === 0) return;
    addItemsToBooking(
      booking.referenceNumber,
      validDrafts.map((d) => ({
        name: d.name.trim(),
        category: d.category,
        quantity: d.quantity,
        conditionNote: d.conditionNote.trim() || "No notes",
        photoName: d.photoName,
      }))
    );
    setDrafts([emptyDraft()]);
    setToast(true);
  }

  function handleContinue() {
    if (booking && validDrafts.length > 0) handleSaveItems();
    if (booking) router.push(`/confirmation?ref=${booking.referenceNumber}`);
  }

  if (!booking) {
    return (
      <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft sm:p-8">
        <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="Enter booking reference, e.g. SSS-24081"
            className="flex-1 rounded-xl border border-navy-200 px-4 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
          <button
            type="submit"
            className="rounded-xl bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-900"
          >
            Find Booking
          </button>
        </form>
        {lookupError && (
          <p className="mt-3 text-sm text-red-500">{lookupError}</p>
        )}
        <p className="mt-4 text-sm text-navy-400">
          Don't have a booking yet?{" "}
          <a href="/book" className="font-medium text-amber-600 underline">
            Book storage first
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-2xl border border-navy-100 bg-navy-50/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Booking Reference
            </p>
            <p className="text-lg font-bold text-navy-900">
              {booking.referenceNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Package
            </p>
            <p className="text-sm font-medium text-navy-700">{pkg?.name}</p>
          </div>
        </div>
      </div>

      {booking.items.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-navy-400">
            Already Registered ({booking.items.length})
          </h2>
          <ul className="mt-3 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
            {booking.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-800">
                    {item.name}{" "}
                    <span className="font-normal text-navy-400">
                      × {item.quantity}
                    </span>
                  </p>
                  <p className="text-xs text-navy-400">{item.conditionNote}</p>
                </div>
                <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-600">
                  {item.category}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-amber-600">
          Add Items
        </h2>
        <div className="mt-3 space-y-4">
          {drafts.map((d, idx) => (
            <div
              key={d.key}
              className="grid gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-soft sm:grid-cols-12 sm:items-start"
            >
              <div className="sm:col-span-4">
                <label className="text-xs font-medium text-navy-500">
                  Item Name
                </label>
                <input
                  value={d.name}
                  onChange={(e) => updateDraft(d.key, { name: e.target.value })}
                  placeholder="e.g. Box of clothes"
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-navy-500">
                  Category
                </label>
                <select
                  value={d.category}
                  onChange={(e) =>
                    updateDraft(d.key, {
                      category: e.target.value as ItemCategory,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-navy-500">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={d.quantity}
                  onChange={(e) =>
                    updateDraft(d.key, {
                      quantity: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-medium text-navy-500">
                  Condition Note
                </label>
                <input
                  value={d.conditionNote}
                  onChange={(e) =>
                    updateDraft(d.key, { conditionNote: e.target.value })
                  }
                  placeholder="e.g. Slight scratch"
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-navy-500">
                  Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateDraft(d.key, {
                      photoName: e.target.files?.[0]?.name,
                    })
                  }
                  className="mt-1 w-full text-xs text-navy-500 file:mr-2 file:rounded-lg file:border-0 file:bg-navy-50 file:px-2 file:py-1.5 file:text-xs file:font-medium file:text-navy-700"
                />
              </div>
              {drafts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDraft(d.key)}
                  className="text-xs font-medium text-red-500 hover:underline sm:col-span-12 sm:justify-self-end"
                >
                  Remove row {idx + 1}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addDraftRow}
          className="mt-3 rounded-xl border border-dashed border-navy-300 px-4 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50"
        >
          + Add another item
        </button>
      </div>

      <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
        <h3 className="text-sm font-bold text-teal-800">
          Inventory Summary (this session)
        </h3>
        {validDrafts.length === 0 ? (
          <p className="mt-2 text-sm text-teal-700/70">
            No new items added yet — fill in an item name above.
          </p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-teal-800">
            {validDrafts.map((d) => (
              <li key={d.key}>
                • {d.name} × {d.quantity} ({d.category})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSaveItems}
          disabled={validDrafts.length === 0}
          className="flex-1 rounded-xl border border-navy-800 px-6 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Items & Add More
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={validDrafts.length === 0 && booking.items.length === 0}
          className="flex-1 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-soft hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review & Confirm Booking →
        </button>
      </div>

      <Toast
        message="Items saved to your inventory."
        show={toast}
        onClose={() => setToast(false)}
      />
    </div>
  );
}
