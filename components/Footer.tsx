import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-navy-950">
                S
              </span>
              <span className="text-base font-extrabold text-white">
                StudentStorageABU
              </span>
            </div>
            <p className="mt-3 text-sm text-navy-300">
              Store Smart. Travel Free.
            </p>
            <p className="mt-1 text-xs text-navy-400">
              A GENS 202 group innovation project — Ahmadu Bello University,
              Zaria.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Navigate</h4>
            <ul className="mt-3 space-y-2 text-sm text-navy-300">
              <li><Link href="/packages" className="hover:text-amber-400">Storage Packages</Link></li>
              <li><Link href="/book" className="hover:text-amber-400">Book Storage</Link></li>
              <li><Link href="/pickup" className="hover:text-amber-400">Track / Request Pickup</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400">Operator Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Contact (placeholder)</h4>
            <ul className="mt-3 space-y-2 text-sm text-navy-300">
              <li>Ahmadu Bello University, Zaria</li>
              <li>hello@studentstorage-abu.demo</li>
              <li>WhatsApp: +234 800 000 0000</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Follow (placeholder)</h4>
            <div className="mt-3 flex gap-3">
              {["IG", "X", "FB", "TT"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-xs font-semibold text-navy-200"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-navy-400">
              Social links are placeholders for this prototype.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-800 pt-6 text-center text-xs text-navy-400">
          © {new Date().getFullYear()} Student Storage Service — Academic
          prototype, not a live commercial service.
        </div>
      </div>
    </footer>
  );
}
