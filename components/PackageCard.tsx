import Link from "next/link";
import { Package } from "@/lib/types";

function formatNGN(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-soft transition-transform hover:-translate-y-1 ${
        pkg.recommended ? "border-amber-400 ring-2 ring-amber-200" : "border-navy-100"
      }`}
    >
      {pkg.recommended && (
        <span className="absolute -top-3 left-6 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-navy-950">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold text-navy-900">{pkg.name}</h3>
      <p className="mt-2 text-sm text-navy-500">{pkg.sizeDescription}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-navy-900">
          {formatNGN(pkg.priceNGN)}
        </span>
        <span className="text-sm text-navy-400">/ {pkg.priceUnit.replace("per ", "")}</span>
      </div>
      <p className="mt-1 text-xs text-navy-400">
        Illustrative pricing, subject to market research
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {pkg.durationOptions.map((d) => (
          <span
            key={d}
            className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-600"
          >
            {d}
          </span>
        ))}
      </div>

      <ul className="mt-5 flex-1 space-y-2.5">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-navy-700">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-teal-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/book?packageId=${pkg.id}`}
        className="mt-6 block rounded-xl bg-navy-800 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-navy-900"
      >
        Select Package
      </Link>
    </div>
  );
}
