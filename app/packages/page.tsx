import { PACKAGES } from "@/lib/seedData";
import PackageCard from "@/components/PackageCard";

export default function PackagesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-navy-900">
          Storage Packages
        </h1>
        <p className="mt-3 text-navy-500">
          Choose the size and duration that matches what you need to store.
          All packages include secure handling and a digital inventory
          record. Pricing below is{" "}
          <span className="font-semibold text-navy-700">
            illustrative, subject to market research
          </span>{" "}
          for this GENS 202 prototype.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-navy-100 bg-navy-50/60 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-navy-900">
          Not sure what size you need?
        </h2>
        <p className="mt-2 text-sm text-navy-500">
          As a rough guide: a <strong>Small Locker</strong> suits a suitcase
          and a few boxes, a <strong>Medium Crate</strong> fits a mattress
          plus boxes and electronics, and a <strong>Large Room Pack</strong>{" "}
          covers a full hostel room when relocating or leaving for an
          extended period. Our team can help you decide at drop-off.
        </p>
      </div>
    </div>
  );
}
