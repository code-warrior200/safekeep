import Link from "next/link";
import { PACKAGES } from "@/lib/seedData";
import PackageCard from "@/components/PackageCard";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Book",
    desc: "Choose a storage package and pick your dates in under two minutes — no paperwork, no queues.",
  },
  {
    step: "2",
    title: "Register Items",
    desc: "List what you're storing so both you and our team have a clear, timestamped inventory record.",
  },
  {
    step: "3",
    title: "We Store Securely",
    desc: "Your items go into access-controlled storage with tracked handling from drop-off to pickup.",
  },
  {
    step: "4",
    title: "Pickup / Delivery",
    desc: "Request pickup whenever you're back, or opt for delivery straight to your hostel or lodge.",
  },
];

const TRUST_POINTS = [
  {
    title: "Secure, Access-Controlled Storage",
    desc: "Items are kept in monitored units with restricted access — only verified staff handle your belongings.",
    icon: "🔒",
  },
  {
    title: "Full Inventory Tracking",
    desc: "Every item you register is logged with category, quantity and condition notes for full transparency.",
    icon: "📋",
  },
  {
    title: "Insurance-Ready Processes",
    desc: "Condition documentation at drop-off means disputes are rare, and claims (where applicable) are easy.",
    icon: "🛡️",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-amber-300">
            🎓 Built for ABU, Zaria students
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Store Smart. <span className="text-amber-400">Travel Free.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-navy-200">
            We provide ABU students with a safe, affordable and convenient
            way to store their belongings while they travel, relocate, or
            temporarily leave school.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="rounded-full bg-amber-500 px-7 py-3.5 text-base font-semibold text-navy-950 shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-amber-400"
            >
              Book Storage Now
            </Link>
            <Link
              href="/packages"
              className="rounded-full border border-white/30 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              View Packages
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy-300">
            <span>✓ From ₦4,500/month</span>
            <span>✓ Campus pickup & delivery</span>
            <span>✓ Digital inventory receipt</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600">
            How It Works
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-navy-900">
            Four simple steps, zero stress
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s, i) => (
            <div
              key={s.step}
              className="relative rounded-2xl border border-navy-100 bg-white p-6 shadow-soft"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-amber-400">
                {s.step}
              </div>
              <h3 className="mt-4 font-bold text-navy-900">{s.title}</h3>
              <p className="mt-2 text-sm text-navy-500">{s.desc}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-navy-200 lg:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Packages preview */}
      <section className="bg-navy-50/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600">
                Storage Packages
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-navy-900">
                Pick the size that fits your load
              </p>
            </div>
            <Link
              href="/packages"
              className="text-sm font-semibold text-navy-800 underline underline-offset-4 hover:text-amber-600"
            >
              See full details →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & safety */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600">
            Trust & Safety
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-navy-900">
            Your belongings, handled with care
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {TRUST_POINTS.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-navy-100 bg-white p-7 text-center shadow-soft"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl">
                {t.icon}
              </div>
              <h3 className="mt-4 font-bold text-navy-900">{t.title}</h3>
              <p className="mt-2 text-sm text-navy-500">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-navy-900 px-8 py-12 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-2xl font-extrabold text-white">
              Ready to free up your space?
            </h3>
            <p className="mt-1 text-navy-300">
              Book in minutes — pickup available across ABU hostels and lodges.
            </p>
          </div>
          <Link
            href="/book"
            className="shrink-0 rounded-full bg-amber-500 px-7 py-3.5 text-base font-semibold text-navy-950 shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-amber-400"
          >
            Book Storage
          </Link>
        </div>
      </section>
    </div>
  );
}
