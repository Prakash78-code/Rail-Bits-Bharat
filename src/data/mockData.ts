export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  station: string;
  password: string;

  hygieneRating: number;

  // ✅ NEW
  hygieneScore: number;
  fssaiNumber: string;
  fssaiVerified: boolean;

  earnings: number;
  complaintCount: number;
  flagged: boolean;
  menu: MenuItem[];
}

export interface Order {
  id: string;
  pnr: string;
  trainName: string;
  station: string;
  vendorId: string;
  items: { item: MenuItem; qty: number }[];
  total: number;
  status: "placed" | "preparing" | "out_for_delivery" | "delivered";
  qrCode: string;
  eta: number;
  createdAt: number;
  rated: boolean;
  revenueSplit: {
    vendor: number;
    platform: number;
    irctc: number;
    maintenance: number;
  };
}

export interface Complaint {
  id: string;
  orderId: string;
  vendorId: string;
  reasons: string[];
  text: string;
  createdAt: number;
}

export interface AppState {
  vendors: Vendor[];
  orders: Order[];
  complaints: Complaint[];
  jobs: { vendors: number; delivery: number; kitchen: number; hygiene: number };
}

export const STATIONS = [
  "Kanpur Central",
  "Prayagraj Junction",
  "Varanasi Junction",
  "Lucknow",
];

export const COMPLAINT_REASONS = [
  "Food was cold",
  "Wrong item delivered",
  "Poor hygiene",
  "Overpriced",
  "Delivery late",
];

// ✅ Menu Data
const menu1: MenuItem[] = [
  { id: "m1", name: "Paneer Biryani", price: 180, category: "Main" },
  { id: "m2", name: "Butter Chicken Thali", price: 220, category: "Main" },
  { id: "m3", name: "Veg Fried Rice", price: 120, category: "Main" },
  { id: "m4", name: "Masala Chai", price: 30, category: "Beverage" },
  { id: "m5", name: "Samosa (2 pcs)", price: 40, category: "Snack" },
];

const menu2: MenuItem[] = [
  { id: "m6", name: "Rajma Chawal", price: 130, category: "Main" },
  { id: "m7", name: "Chicken Biryani", price: 200, category: "Main" },
  { id: "m8", name: "Aloo Paratha", price: 80, category: "Main" },
  { id: "m9", name: "Lassi", price: 50, category: "Beverage" },
  { id: "m10", name: "Kachori", price: 35, category: "Snack" },
];

const menu3: MenuItem[] = [
  { id: "m11", name: "Dal Makhani Thali", price: 160, category: "Main" },
  { id: "m12", name: "Egg Curry Rice", price: 140, category: "Main" },
  { id: "m13", name: "Chole Bhature", price: 110, category: "Main" },
  { id: "m14", name: "Cold Coffee", price: 60, category: "Beverage" },
  { id: "m15", name: "Bread Pakora", price: 45, category: "Snack" },
];

// ✅ FINAL Vendors (Manual + NEW fields added)
export function createInitialVendors(): Vendor[] {
  return [
    {
      id: "v1",
      name: "Shree Sai Tiffin",
      station: "Lucknow",
      password: "vendor123",
      hygieneRating: 4.2,
      hygieneScore: 87,
      fssaiNumber: "10019022001",
      fssaiVerified: true,
      earnings: 0,
      complaintCount: 0,
      flagged: false,
      menu: menu1,
    },
    {
      id: "v2",
      name: "Railway Dhaba",
      station: "Kanpur Central",
      password: "vendor123",
      hygieneRating: 3.5,
      hygieneScore: 62,
      fssaiNumber: "10019022002",
      fssaiVerified: true,
      earnings: 0,
      complaintCount: 1,
      flagged: false,
      menu: menu2,
    },
    {
      id: "v3",
      name: "Annapurna Kitchen",
      station: "Varanasi Junction",
      password: "vendor123",
      hygieneRating: 4.6,
      hygieneScore: 92,
      fssaiNumber: "10019022003",
      fssaiVerified: true,
      earnings: 0,
      complaintCount: 0,
      flagged: false,
      menu: menu3,
    },
    {
      id: "v4",
      name: "Desi Tadka",
      station: "Prayagraj Junction",
      password: "vendor123",
      hygieneRating: 3.8,
      hygieneScore: 75,
      fssaiNumber: "10019022004",
      fssaiVerified: false,
      earnings: 0,
      complaintCount: 2,
      flagged: false,
      menu: menu1,
    },
  ];
}

// ✅ Revenue
export function calculateRevenueSplit(total: number) {
  const platform = Math.round(total * 0.07);
  const irctc = Math.round(total * 0.03);
  const maintenance = 10;
  const vendor = total - platform - irctc - maintenance;
  return { vendor, platform, irctc, maintenance };
}

// ✅ QR
export function generateQR(): string {
  return `RB-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;
}

// ✅ Order ID
export function generateOrderId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}