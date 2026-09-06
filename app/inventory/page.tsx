import { Suspense } from "react";
import InventoryManager from "./InventoryManager";

export default function InventoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="max-w-xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-navy-900">
          Register Your Items
        </h1>
        <p className="mt-3 text-navy-500">
          Add every item you're storing so we have a clear inventory on file
          — this protects you and helps our team handle your belongings
          correctly.
        </p>
      </div>

      <Suspense fallback={null}>
        <InventoryManager />
      </Suspense>
    </div>
  );
}
