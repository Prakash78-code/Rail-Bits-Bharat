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
  hygieneRating: number;
  complaintCount: number;
  flagged: boolean;
  menu: MenuItem[];
  earnings: number;
  password: string;
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

export const STATIONS = ["Kanpur Central", "Prayagraj Junction", "Varanasi Junction"];

export const COMPLAINT_REASONS = [
  "Food was cold",
  "Wrong item delivered",
  "Poor hygiene",
  "Overpriced",
  "Delivery late",
];

const menuSets: MenuItem[][] = [
  [
    { id: "m1", name: "Paneer Biryani", price: 180, category: "Main" },
    { id: "m2", name: "Butter Chicken Thali", price: 220, category: "Main" },
    { id: "m3", name: "Veg Fried Rice", price: 120, category: "Main" },
    { id: "m4", name: "Masala Chai", price: 30, category: "Beverage" },
    { id: "m5", name: "Samosa (2 pcs)", price: 40, category: "Snack" },
  ],
  [
    { id: "m6", name: "Rajma Chawal", price: 130, category: "Main" },
    { id: "m7", name: "Chicken Biryani", price: 200, category: "Main" },
    { id: "m8", name: "Aloo Paratha", price: 80, category: "Main" },
    { id: "m9", name: "Lassi", price: 50, category: "Beverage" },
    { id: "m10", name: "Kachori", price: 35, category: "Snack" },
  ],
  [
    { id: "m11", name: "Dal Makhani Thali", price: 160, category: "Main" },
    { id: "m12", name: "Egg Curry Rice", price: 140, category: "Main" },
    { id: "m13", name: "Chole Bhature", price: 110, category: "Main" },
    { id: "m14", name: "Cold Coffee", price: 60, category: "Beverage" },
    { id: "m15", name: "Bread Pakora", price: 45, category: "Snack" },
  ],
];

const vendorNames = [
  "Shree Krishna Foods", "Maharaja Catering", "Annapurna Kitchen",
  "Bharat Bhojan", "Royal Meals", "Desi Tadka", "Punjab Express",
  "South Indian Corner", "Ganga Foods", "Lucknowi Dastarkhwan",
  "Varanasi Rasoi", "Station Fresh", "Quick Bite Express",
  "Swadeshi Kitchen", "HomeTaste Railway",
];

export function createInitialVendors(): Vendor[] {
  const vendors: Vendor[] = [];
  let idx = 0;
  STATIONS.forEach((station) => {
    for (let i = 0; i < 5; i++) {
      vendors.push({
        id: `v${idx + 1}`,
        name: vendorNames[idx % vendorNames.length],
        station,
        hygieneRating: 3.5 + Math.random() * 1.5,
        complaintCount: Math.floor(Math.random() * 2),
        flagged: false,
        menu: menuSets[idx % menuSets.length].map((m) => ({ ...m, id: `${m.id}_${idx}` })),
        earnings: 0,
        password: "vendor123",
      });
      idx++;
    }
  });
  return vendors;
}

export function calculateRevenueSplit(total: number) {
  const platform = Math.round(total * 0.07);
  const irctc = Math.round(total * 0.03);
  const maintenance = 10;
  const vendor = total - platform - irctc - maintenance;
  return { vendor, platform, irctc, maintenance };
}

export function generateQR(): string {
  return `RB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function generateOrderId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}
