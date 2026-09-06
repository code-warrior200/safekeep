"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { AccommodationType } from "@/lib/types";

const ACCOMMODATION_TYPES: AccommodationType[] = [
  "ABU Hostel (On-Campus)",
  "Off-Campus Lodge",
  "Private Apartment",
  "Other",
];

interface FormState {
  studentName: string;
  regNumber: string;
  phone: string;
  accommodationType: AccommodationType;
  packageId: string;
  startDate: string;
  expectedPickupDate: string;
  pickupDeliveryAddOn: boolean;
  deliveryAddress: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { packages, createBooking, user } = useStore();

  const preselected = searchParams.get("packageId") ?? "";

  const [form, setForm] = useState<FormState>({
    studentName: user?.name ?? "",
    regNumber: "",
    phone: "",
    accommodationType: "ABU Hostel (On-Campus)",
    packageId: preselected || packages[0]?.id || "",
    startDate: "",
    expectedPickupDate: "",
    pickupDeliveryAddOn: false,
    deliveryAddress: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === form.packageId),
    [packages, form.packageId]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.studentName.trim()) next.studentName = "Full name is required.";
    if (!form.regNumber.trim())
      next.regNumber = "Registration number is required.";
    else if (!/^[A-Za-z0-9/]{5,}$/.test(form.regNumber.trim()))
      next.regNumber = "Enter a valid registration number.";
    if (!form.phone.trim()) next.phone = "Phone / WhatsApp number is required.";
    else if (!/^(\+?\d{10,14})$/.test(form.phone.trim().replace(/\s/g, "")))
      next.phone = "Enter a valid phone number (digits only, 10-14).";
    if (!form.packageId) next.packageId = "Please select a package.";
    if (!form.startDate) next.startDate = "Storage start date is required.";
    if (!form.expectedPickupDate)
      next.expectedPickupDate = "Expected pickup date is required.";
    if (
      form.startDate &&
      form.expectedPickupDate &&
      new Date(form.expectedPickupDate) <= new Date(form.startDate)
    ) {
      next.expectedPickupDate = "Pickup date must be after the start date.";
    }
    if (form.pickupDeliveryAddOn && !form.deliveryAddress.trim()) {
      next.deliveryAddress = "Enter a delivery address, or turn the add-on off.";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const booking = createBooking({
      studentName: form.studentName.trim(),
      regNumber: form.regNumber.trim().toUpperCase(),
      phone: form.phone.trim(),
      accommodationType: form.accommodationType,
      packageId: form.packageId,
      startDate: form.startDate,
      expectedPickupDate: form.expectedPickupDate,
      pickupDeliveryAddOn: form.pickupDeliveryAddOn,
      deliveryAddress: form.pickupDeliveryAddOn
        ? form.deliveryAddress.trim()
        : undefined,
    });

    router.push(`/inventory?ref=${booking.referenceNumber}&new=1`);
  }

  const inputClass = (hasError?: string) =>
    `mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-300 focus:ring-red-100"
        : "border-navy-200 focus:border-navy-500 focus:ring-navy-100"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 space-y-8 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft sm:p-8"
      noValidate
    >
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="col-span-full text-sm font-bold uppercase tracking-wide text-amber-600">
          Your Details
        </legend>

        <label className="block text-sm font-medium text-navy-700">
          Full Name
          <input
            className={inputClass(errors.studentName)}
            value={form.studentName}
            onChange={(e) => update("studentName", e.target.value)}
            placeholder="e.g. Aisha Mohammed"
          />
          {errors.studentName && (
            <p className="mt-1 text-xs text-red-500">{errors.studentName}</p>
          )}
        </label>

        <label className="block text-sm font-medium text-navy-700">
          Registration Number
          <input
            className={inputClass(errors.regNumber)}
            value={form.regNumber}
            onChange={(e) => update("regNumber", e.target.value)}
            placeholder="e.g. U21CS1234"
          />
          {errors.regNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.regNumber}</p>
          )}
        </label>

        <label className="block text-sm font-medium text-navy-700">
          Phone / WhatsApp Number
          <input
            className={inputClass(errors.phone)}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="e.g. 08012345678"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </label>

        <label className="block text-sm font-medium text-navy-700">
          Hostel / Accommodation Type
          <select
            className={inputClass()}
            value={form.accommodationType}
            onChange={(e) =>
              update("accommodationType", e.target.value as AccommodationType)
            }
          >
            {ACCOMMODATION_TYPES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="col-span-full text-sm font-bold uppercase tracking-wide text-amber-600">
          Storage Plan
        </legend>

        <label className="block text-sm font-medium text-navy-700 sm:col-span-2">
          Selected Package
          <select
            className={inputClass(errors.packageId)}
            value={form.packageId}
            onChange={(e) => update("packageId", e.target.value)}
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ₦{p.priceNGN.toLocaleString("en-NG")}/
                {p.priceUnit.replace("per ", "")}
              </option>
            ))}
          </select>
          {errors.packageId && (
            <p className="mt-1 text-xs text-red-500">{errors.packageId}</p>
          )}
          {selectedPackage && (
            <p className="mt-1.5 text-xs text-navy-400">
              {selectedPackage.sizeDescription}
            </p>
          )}
        </label>

        <label className="block text-sm font-medium text-navy-700">
          Storage Start Date
          <input
            type="date"
            className={inputClass(errors.startDate)}
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
          )}
        </label>

        <label className="block text-sm font-medium text-navy-700">
          Expected Pickup Date
          <input
            type="date"
            className={inputClass(errors.expectedPickupDate)}
            value={form.expectedPickupDate}
            onChange={(e) => update("expectedPickupDate", e.target.value)}
          />
          {errors.expectedPickupDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.expectedPickupDate}
            </p>
          )}
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold uppercase tracking-wide text-amber-600">
          Pickup & Delivery
        </legend>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-navy-100 bg-navy-50/60 px-4 py-3.5">
          <span className="text-sm font-medium text-navy-700">
            Add pickup &amp; delivery service (we collect and deliver your
            items)
          </span>
          <input
            type="checkbox"
            checked={form.pickupDeliveryAddOn}
            onChange={(e) => update("pickupDeliveryAddOn", e.target.checked)}
            className="h-5 w-5 rounded border-navy-300 text-amber-500 focus:ring-amber-400"
          />
        </label>

        {form.pickupDeliveryAddOn && (
          <label className="block text-sm font-medium text-navy-700">
            Delivery Address
            <input
              className={inputClass(errors.deliveryAddress)}
              value={form.deliveryAddress}
              onChange={(e) => update("deliveryAddress", e.target.value)}
              placeholder="e.g. Ribadu Hostel, Room A4, ABU Main Campus"
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-xs text-red-500">
                {errors.deliveryAddress}
              </p>
            )}
          </label>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-navy-950 shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-amber-400 disabled:opacity-60"
      >
        {submitting ? "Booking..." : "Confirm Booking Details"}
      </button>
      <p className="text-center text-xs text-navy-400">
        You'll register your items in the next step. No payment is collected
        in this prototype.
      </p>
    </form>
  );
}
