"use client";

import { useEffect } from "react";

export default function Toast({
  message,
  show,
  onClose,
}: {
  message: string;
  show: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-2xl bg-navy-900 px-5 py-4 text-white shadow-soft animate-fade-in-up">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 animate-check-pop">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
