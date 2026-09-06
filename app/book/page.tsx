import { Suspense } from "react";
import BookingForm from "./BookingForm";

export default function BookPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="max-w-xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-navy-900">
          Book Storage
        </h1>
        <p className="mt-3 text-navy-500">
          Fill in your details below. It takes about two minutes — you'll get
          a booking reference immediately, then register your items next.
        </p>
      </div>

      <Suspense fallback={null}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
