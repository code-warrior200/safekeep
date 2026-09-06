# Student Storage Service (ABU, Zaria) — GENS 202 Prototype

**Store Smart. Travel Free.**

A prototype booking platform that lets Ahmadu Bello University (ABU) students
book secure, affordable temporary storage for their belongings while they
travel, relocate, or leave school for a break. Built for a GENS 202 group
innovation project pitch — polished enough to demo live, with no real
backend required.

## Running the app

Requirements: Node.js 18.18+ (tested on Node 22) and npm.

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in a browser (works well on mobile
viewports too — try your browser's device toolbar for the pitch demo).

To create a production build:

```bash
npm run build
npm start
```

## What's real vs. what's mocked

This is an academic prototype. The user flows, validation, and UI are fully
functional — but the following are intentionally simulated rather than
backed by real infrastructure:

| Feature | Status |
|---|---|
| Booking, inventory, pickup, and dashboard flows | ✅ Fully working (client-side) |
| Form validation | ✅ Real client-side validation |
| Data persistence | 🟡 Simulated — stored in the browser's `localStorage`, seeded with demo data on first load. Clearing site data resets it. |
| "Sign in" | 🟡 Mocked — just captures a display name, no accounts or passwords |
| Payments | ❌ Not implemented — pricing is shown as "illustrative, subject to market research" and no payment is ever collected |
| SMS / WhatsApp | ❌ Not implemented — buttons/links are placeholders only |
| Photo upload | 🟡 File picker only — the filename is recorded, but no file is actually uploaded or stored anywhere |
| Database / server API | ❌ None — there is no backend. All "storage operator" data (the Admin dashboard) reads from the same local browser state as the student-facing pages |

Because everything lives in `localStorage`, the app **remembers your demo
data between page reloads on the same browser**, but a different browser,
device, or incognito window will start fresh from the seed data.

## Pages

- `/` — Homepage: hero, "How It Works", package preview, trust & safety, CTA
- `/packages` — Storage Packages: 3 tiers with illustrative ₦ pricing
- `/book` — Booking Form: student details, package, dates, pickup/delivery add-on
- `/inventory?ref=SSS-XXXXX` — Item Inventory / Registration, linked to a booking reference
- `/pickup?ref=SSS-XXXXX` — Pickup Request & live status lookup
- `/confirmation?ref=SSS-XXXXX` — Booking Confirmation summary (printable)
- `/admin` — Operator Dashboard: table of all bookings across all students

## Demo tips

- Two sample bookings are seeded so the app isn't empty on first load:
  `SSS-24081` (In Storage, pickup+delivery add-on) and `SSS-24102` (Pickup
  Scheduled).
- Try the full happy path live: **Packages → Select Package → Book Storage
  form → Register Items → Confirmation → Pickup/Status → Admin Dashboard**.
- The "Mock Sign In" button in the header is just for pitch flavor — it
  pre-fills your name on the booking form.
- The Confirmation page has a working print button (`window.print()`) for
  "download/print confirmation".

## Tech stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS
- No external database — a React Context (`lib/store.tsx`) holds state and
  mirrors it to `localStorage`, seeded from `lib/seedData.ts`

## Data model

```ts
Package { id, name, sizeDescription, durationOptions[], priceNGN, priceUnit, features[] }

Booking {
  id, referenceNumber, studentName, regNumber, phone, accommodationType,
  packageId, startDate, expectedPickupDate, pickupDeliveryAddOn,
  deliveryAddress?, status: "In Storage" | "Pickup Scheduled" | "Returned",
  items: InventoryItem[]
}

InventoryItem { id, name, category, quantity, conditionNote, photoName? }
```

## Out of scope (by design)

Real payment processing, real authentication/accounts, real SMS/WhatsApp
integration, and a real database are all explicitly out of scope for this
prototype — see the table above for what stands in for each.
