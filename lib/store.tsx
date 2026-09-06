"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Booking, BookingStatus, InventoryItem, Package } from "./types";
import { PACKAGES, SEED_BOOKINGS } from "./seedData";

const BOOKINGS_KEY = "sss_bookings_v1";
const USER_KEY = "sss_user_v1";

export interface MockUser {
  name: string;
  regNumber: string;
}

interface StoreContextValue {
  packages: Package[];
  bookings: Booking[];
  user: MockUser | null;
  setUser: (user: MockUser | null) => void;
  getPackageById: (id: string) => Package | undefined;
  getBookingByReference: (ref: string) => Booking | undefined;
  createBooking: (
    data: Omit<
      Booking,
      "id" | "referenceNumber" | "status" | "items" | "createdAt"
    >
  ) => Booking;
  addItemsToBooking: (
    referenceNumber: string,
    items: Omit<InventoryItem, "id">[]
  ) => Booking | undefined;
  updateBookingStatus: (
    referenceNumber: string,
    status: BookingStatus,
    extra?: { expectedPickupDate?: string; deliveryAddress?: string }
  ) => Booking | undefined;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function generateReference(existing: Booking[]): string {
  let ref = "";
  do {
    const num = Math.floor(10000 + Math.random() * 89999);
    ref = `SSS-${num}`;
  } while (existing.some((b) => b.referenceNumber === ref));
  return ref;
}

function loadBookings(): Booking[] {
  if (typeof window === "undefined") return SEED_BOOKINGS;
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return SEED_BOOKINGS;
    const parsed = JSON.parse(raw) as Booking[];
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_BOOKINGS;
    return parsed;
  } catch {
    return SEED_BOOKINGS;
  }
}

function loadUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [user, setUserState] = useState<MockUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBookings(loadBookings());
    setUserState(loadUser());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
      // ignore persistence errors (e.g. private browsing)
    }
  }, [bookings, hydrated]);

  const setUser = useCallback((next: MockUser | null) => {
    setUserState(next);
    try {
      if (next) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(USER_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const getPackageById = useCallback(
    (id: string) => PACKAGES.find((p) => p.id === id),
    []
  );

  const getBookingByReference = useCallback(
    (ref: string) =>
      bookings.find(
        (b) => b.referenceNumber.toLowerCase() === ref.trim().toLowerCase()
      ),
    [bookings]
  );

  // Note: these mutators compute the resulting Booking synchronously from the
  // `bookings` closure (rather than inside the setState updater) because
  // callers need the created/updated Booking immediately for navigation —
  // functional setState updaters don't run synchronously in the same tick.
  const createBooking: StoreContextValue["createBooking"] = useCallback(
    (data) => {
      const referenceNumber = generateReference(bookings);
      const created: Booking = {
        ...data,
        id: `bk-${Date.now()}`,
        referenceNumber,
        status: "In Storage",
        items: [],
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => [...prev, created]);
      return created;
    },
    [bookings]
  );

  const addItemsToBooking: StoreContextValue["addItemsToBooking"] =
    useCallback(
      (referenceNumber, items) => {
        const target = bookings.find(
          (b) => b.referenceNumber.toLowerCase() === referenceNumber.toLowerCase()
        );
        if (!target) return undefined;
        const newItems: InventoryItem[] = items.map((it, idx) => ({
          ...it,
          id: `it-${Date.now()}-${idx}`,
        }));
        const updated: Booking = { ...target, items: [...target.items, ...newItems] };
        setBookings((prev) =>
          prev.map((b) => (b.id === target.id ? updated : b))
        );
        return updated;
      },
      [bookings]
    );

  const updateBookingStatus: StoreContextValue["updateBookingStatus"] =
    useCallback(
      (referenceNumber, status, extra) => {
        const target = bookings.find(
          (b) => b.referenceNumber.toLowerCase() === referenceNumber.toLowerCase()
        );
        if (!target) return undefined;
        const updated: Booking = {
          ...target,
          status,
          expectedPickupDate: extra?.expectedPickupDate ?? target.expectedPickupDate,
          deliveryAddress: extra?.deliveryAddress ?? target.deliveryAddress,
          pickupDeliveryAddOn: extra?.deliveryAddress
            ? true
            : target.pickupDeliveryAddOn,
        };
        setBookings((prev) =>
          prev.map((b) => (b.id === target.id ? updated : b))
        );
        return updated;
      },
      [bookings]
    );

  const value = useMemo<StoreContextValue>(
    () => ({
      packages: PACKAGES,
      bookings,
      user,
      setUser,
      getPackageById,
      getBookingByReference,
      createBooking,
      addItemsToBooking,
      updateBookingStatus,
    }),
    [
      bookings,
      user,
      setUser,
      getPackageById,
      getBookingByReference,
      createBooking,
      addItemsToBooking,
      updateBookingStatus,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
