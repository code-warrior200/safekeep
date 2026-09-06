import { Suspense } from "react";
import ConfirmationView from "./ConfirmationView";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Suspense fallback={null}>
        <ConfirmationView />
      </Suspense>
    </div>
  );
}
