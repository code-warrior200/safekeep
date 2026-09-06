export interface Package {
  id: string;
  name: string;
  sizeDescription: string;
  durationOptions: string[];
  priceNGN: number;
  priceUnit: string;
  features: string[];
  recommended?: boolean;
}

export type ItemCategory =
  | "Clothing"
  | "Electronics"
  | "Books"
  | "Mattress/Bedding"
  | "Furniture"
  | "Other";

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  conditionNote: string;
  photoName?: string;
}

export type BookingStatus = "In Storage" | "Pickup Scheduled" | "Returned";

export type AccommodationType =
  | "ABU Hostel (On-Campus)"
  | "Off-Campus Lodge"
  | "Private Apartment"
  | "Other";

export interface Booking {
  id: string;
  referenceNumber: string;
  studentName: string;
  regNumber: string;
  phone: string;
  accommodationType: AccommodationType;
  packageId: string;
  startDate: string;
  expectedPickupDate: string;
  pickupDeliveryAddOn: boolean;
  deliveryAddress?: string;
  status: BookingStatus;
  items: InventoryItem[];
  createdAt: string;
}
