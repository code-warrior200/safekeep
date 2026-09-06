import { Booking, Package } from "./types";

export const PACKAGES: Package[] = [
  {
    id: "pkg-small",
    name: "Small Locker",
    sizeDescription:
      "Fits a few boxes, a suitcase, or a couple of bags — ideal for clothing, books, and small electronics.",
    durationOptions: ["1 Month", "3 Months", "Full Semester Break"],
    priceNGN: 2500,
    priceUnit: "per month",
    features: [
      "Up to 5 medium items",
      "Shared secure storage room",
      "Digital inventory tracking",
      "Standard drop-off & pickup",
    ],
  },
  {
    id: "pkg-medium",
    name: "Medium Crate",
    sizeDescription:
      "Half a room's worth of stuff — great for a mattress, small furniture, boxes, and electronics combined.",
    durationOptions: ["1 Month", "3 Months", "Full Semester Break", "Full Session"],
    priceNGN: 3500,
    priceUnit: "per month",
    features: [
      "Up to 12 medium items or 1 mattress + boxes",
      "Secure caged storage unit",
      "Digital inventory tracking with photos",
      "Free pickup within campus & hostel zones",
      "Priority scheduling",
    ],
    recommended: true,
  },
  {
    id: "pkg-large",
    name: "Large Room Pack",
    sizeDescription:
      "A full hostel room load — mattress, furniture, boxes, electronics. Best for relocating or long breaks.",
    durationOptions: ["3 Months", "Full Semester Break", "Full Session", "1 Year"],
    priceNGN: 4500,
    priceUnit: "per month",
    features: [
      "Unlimited items within one dedicated unit",
      "Private lockable storage unit",
      "Full digital inventory with photo verification",
      "Free pickup & delivery, campus-wide",
      "Insurance-ready condition reports",
    ],
  },
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: "bk-1",
    referenceNumber: "SSS-24081",
    studentName: "Amina Bello",
    regNumber: "U19CS1042",
    phone: "08031234567",
    accommodationType: "ABU Hostel (On-Campus)",
    packageId: "pkg-medium",
    startDate: "2026-07-10",
    expectedPickupDate: "2026-09-20",
    pickupDeliveryAddOn: true,
    deliveryAddress: "Suleiman Hostel, Room B12, ABU Main Campus",
    status: "In Storage",
    items: [
      {
        id: "it-1",
        name: "Mattress (6x4)",
        category: "Mattress/Bedding",
        quantity: 1,
        conditionNote: "Good condition, slightly worn corner",
      },
      {
        id: "it-2",
        name: "Box of textbooks",
        category: "Books",
        quantity: 2,
        conditionNote: "Sealed cartons, no damage",
      },
      {
        id: "it-3",
        name: "Reading lamp",
        category: "Electronics",
        quantity: 1,
        conditionNote: "Working, minor scratch on base",
      },
    ],
    createdAt: "2026-07-08T10:15:00.000Z",
  },
  {
    id: "bk-2",
    referenceNumber: "SSS-24102",
    studentName: "Chinedu Okafor",
    regNumber: "U20ME2201",
    phone: "07056789012",
    accommodationType: "Off-Campus Lodge",
    packageId: "pkg-small",
    startDate: "2026-08-01",
    expectedPickupDate: "2026-09-15",
    pickupDeliveryAddOn: false,
    status: "Pickup Scheduled",
    items: [
      {
        id: "it-4",
        name: "Suitcase of clothes",
        category: "Clothing",
        quantity: 1,
        conditionNote: "Good condition",
      },
      {
        id: "it-5",
        name: "Laptop bag",
        category: "Electronics",
        quantity: 1,
        conditionNote: "Contains charger only, no laptop",
      },
    ],
    createdAt: "2026-07-30T14:40:00.000Z",
  },
];
