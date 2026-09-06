import { Suspense } from "react";
import PickupManager from "./PickupManager";

export default function PickupPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="max-w-xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-navy-900">
          Pickup / Status
        </h1>
        <p className="mt-3 text-navy-500">
          Look up your booking to check its current status or request a
          pickup or delivery date.
        </p>
      </div>

      <Suspense fallback={null}>
        <PickupManager />
      </Suspense>
    </div>
  );
}
