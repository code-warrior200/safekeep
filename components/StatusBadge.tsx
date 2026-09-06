import { BookingStatus } from "@/lib/types";

const STYLES: Record<BookingStatus, string> = {
  "In Storage": "bg-teal-50 text-teal-800 ring-teal-200",
  "Pickup Scheduled": "bg-amber-50 text-amber-800 ring-amber-200",
  Returned: "bg-navy-50 text-navy-600 ring-navy-200",
};

const DOT: Record<BookingStatus, string> = {
  "In Storage": "bg-teal-500",
  "Pickup Scheduled": "bg-amber-500",
  Returned: "bg-navy-400",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {status}
    </span>
  );
}
