"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/book", label: "Book Storage" },
  { href: "/pickup", label: "Pickup / Status" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, setUser } = useStore();
  const [open, setOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800 text-lg font-bold text-amber-400">
            S
          </span>
          <span className="text-lg font-extrabold tracking-tight text-navy-900">
            StudentStorage<span className="text-amber-500">ABU</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-navy-800 text-white"
                  : "text-navy-700 hover:bg-navy-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-sm text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Logged in as <span className="font-semibold">{user.name}</span>
              <button
                onClick={() => setUser(null)}
                className="ml-1 text-xs font-medium text-teal-700 underline underline-offset-2 hover:text-teal-900"
              >
                sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
            >
              Mock Sign In
            </button>
          )}
          <Link
            href="/book"
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-amber-400"
          >
            Book Storage
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-navy-800 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-navy-100 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-navy-800 text-white"
                    : "text-navy-700 hover:bg-navy-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-navy-100 pt-3">
            {user ? (
              <div className="text-sm text-navy-700">
                Signed in as <span className="font-semibold">{user.name}</span>
                <button
                  onClick={() => setUser(null)}
                  className="ml-2 text-xs text-teal-700 underline"
                >
                  sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="rounded-full border border-navy-200 px-3 py-1.5 text-sm font-medium text-navy-700"
              >
                Mock Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft animate-fade-in-up">
            <h3 className="text-lg font-bold text-navy-900">Mock Sign In</h3>
            <p className="mt-1 text-sm text-navy-500">
              No real authentication — just tell us your name for this demo
              session.
            </p>
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="e.g. Fatima Suleiman"
              className="mt-4 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowLogin(false)}
                className="flex-1 rounded-xl border border-navy-200 px-4 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!nameDraft.trim()) return;
                  setUser({ name: nameDraft.trim(), regNumber: "" });
                  setShowLogin(false);
                  setNameDraft("");
                }}
                className="flex-1 rounded-xl bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-900"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
