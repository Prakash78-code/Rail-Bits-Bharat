// ─── Types ────────────────────────────────────────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isVeg: boolean;
  prepTime: number; // minutes
  rating: number;
  image?: string;
  description?: string;
  available: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  station: string;
  stationCode: string;
  password: string;
  hygieneRating: number;
  hygieneScore: number;
  fssaiNumber: string;
  fssaiVerified: boolean;
  earnings: number;
  complaintCount: number;
  flagged: boolean;
  menu: MenuItem[];
  cuisine: string[];
  isSHG: boolean;
  avgDeliveryTime: number; // minutes
  totalOrders: number;
  approved: boolean;
}

export interface Order {
  id: string;
  pnr: string;
  trainName: string;
  trainNumber: string;
  station: string;
  coach: string;
  seat: string;
  vendorId: string;
  items: { item: MenuItem; qty: number }[];
  total: number;
  status: "placed" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  qrCode: string;
  eta: number;
  createdAt: number;
  rated: boolean;
  paymentMethod: string;
  revenueSplit: { vendor: number; platform: number; irctc: number; maintenance: number };
}

export interface Complaint {
  id: string;
  orderId: string;
  vendorId: string;
  reasons: string[];
  text: string;
  createdAt: number;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
}

export interface Station {
  id: string;
  name: string;
  code: string;
  zone: string;
  state: string;
  lat: number;
  lng: number;
  platforms: number;
}

export interface TrainRoute {
  trainNumber: string;
  trainName: string;
  type: string;
  stations: { stationCode: string; arrivalTime: string; departureTime: string; day: number }[];
}

export interface AppState {
  vendors: Vendor[];
  orders: Order[];
  complaints: Complaint[];
  jobs: { vendors: number; delivery: number; kitchen: number; hygiene: number };
}

// ─── Stations ─────────────────────────────────────────────────────────────────
export const STATION_LIST: Station[] = [
  { id: "s1", name: "New Delhi", code: "NDLS", zone: "NR", state: "Delhi", lat: 28.6419, lng: 77.2194, platforms: 16 },
  { id: "s2", name: "Mumbai Central", code: "BCT", zone: "WR", state: "Maharashtra", lat: 18.9691, lng: 72.8193, platforms: 9 },
  { id: "s3", name: "Chennai Central", code: "MAS", zone: "SR", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, platforms: 17 },
  { id: "s4", name: "Howrah Junction", code: "HWH", zone: "ER", state: "West Bengal", lat: 22.5839, lng: 88.3427, platforms: 23 },
  { id: "s5", name: "Bangalore City", code: "SBC", zone: "SWR", state: "Karnataka", lat: 12.9784, lng: 77.5696, platforms: 10 },
  { id: "s6", name: "Lucknow", code: "LKO", zone: "NR", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, platforms: 9 },
  { id: "s7", name: "Kanpur Central", code: "CNB", zone: "NCR", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319, platforms: 10 },
  { id: "s8", name: "Prayagraj Junction", code: "ALD", zone: "NCR", state: "Uttar Pradesh", lat: 25.4358, lng: 81.8463, platforms: 10 },
  { id: "s9", name: "Varanasi Junction", code: "BSB", zone: "NER", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739, platforms: 9 },
  { id: "s10", name: "Jaipur", code: "JP", zone: "NWR", state: "Rajasthan", lat: 26.9124, lng: 75.7873, platforms: 6 },
  { id: "s11", name: "Ahmedabad Junction", code: "ADI", zone: "WR", state: "Gujarat", lat: 23.0268, lng: 72.5987, platforms: 12 },
  { id: "s12", name: "Hyderabad Deccan", code: "HYB", zone: "SCR", state: "Telangana", lat: 17.3947, lng: 78.4559, platforms: 6 },
  { id: "s13", name: "Pune Junction", code: "PUNE", zone: "CR", state: "Maharashtra", lat: 18.5196, lng: 73.8553, platforms: 6 },
  { id: "s14", name: "Bhopal Junction", code: "BPL", zone: "WCR", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126, platforms: 5 },
  { id: "s15", name: "Nagpur Junction", code: "NGP", zone: "CR", state: "Maharashtra", lat: 21.1466, lng: 79.0830, platforms: 8 },
];

export const STATIONS = STATION_LIST.map(s => s.name);

// ─── Train Routes ─────────────────────────────────────────────────────────────
export const TRAIN_ROUTES: TrainRoute[] = [
  {
    trainNumber: "12951", trainName: "Mumbai Rajdhani", type: "Rajdhani",
    stations: [
      { stationCode: "NDLS", arrivalTime: "16:55", departureTime: "17:00", day: 1 },
      { stationCode: "BPL", arrivalTime: "22:40", departureTime: "22:45", day: 1 },
      { stationCode: "NGP", arrivalTime: "03:15", departureTime: "03:20", day: 2 },
      { stationCode: "BCT", arrivalTime: "07:55", departureTime: "--", day: 2 },
    ]
  },
  {
    trainNumber: "12301", trainName: "Howrah Rajdhani", type: "Rajdhani",
    stations: [
      { stationCode: "NDLS", arrivalTime: "17:00", departureTime: "17:05", day: 1 },
      { stationCode: "CNB", arrivalTime: "21:10", departureTime: "21:15", day: 1 },
      { stationCode: "ALD", arrivalTime: "23:10", departureTime: "23:15", day: 1 },
      { stationCode: "BSB", arrivalTime: "01:50", departureTime: "01:55", day: 2 },
      { stationCode: "HWH", arrivalTime: "10:05", departureTime: "--", day: 2 },
    ]
  },
  {
    trainNumber: "12627", trainName: "Karnataka Express", type: "Express",
    stations: [
      { stationCode: "NDLS", arrivalTime: "20:30", departureTime: "20:30", day: 1 },
      { stationCode: "BPL", arrivalTime: "04:00", departureTime: "04:05", day: 2 },
      { stationCode: "HYB", arrivalTime: "13:45", departureTime: "13:50", day: 2 },
      { stationCode: "SBC", arrivalTime: "07:00", departureTime: "--", day: 3 },
    ]
  },
  {
    trainNumber: "12621", trainName: "Tamil Nadu Express", type: "Express",
    stations: [
      { stationCode: "NDLS", arrivalTime: "22:30", departureTime: "22:30", day: 1 },
      { stationCode: "NGP", arrivalTime: "09:20", departureTime: "09:25", day: 2 },
      { stationCode: "MAS", arrivalTime: "07:40", departureTime: "--", day: 3 },
    ]
  },
  {
    trainNumber: "12985", trainName: "Jaipur Shatabdi", type: "Shatabdi",
    stations: [
      { stationCode: "NDLS", arrivalTime: "06:05", departureTime: "06:05", day: 1 },
      { stationCode: "JP", arrivalTime: "10:40", departureTime: "--", day: 1 },
    ]
  },
];

// ─── Menu Items ───────────────────────────────────────────────────────────────
const menu_sai: MenuItem[] = [
  { id: "m1", name: "Paneer Biryani", price: 180, category: "Main Course", isVeg: true, prepTime: 15, rating: 4.5, description: "Fragrant basmati rice with soft paneer cubes in aromatic spices", available: true },
  { id: "m2", name: "Butter Chicken Thali", price: 220, category: "Main Course", isVeg: false, prepTime: 20, rating: 4.7, description: "Tender chicken in rich tomato-butter gravy with roti, dal & salad", available: true },
  { id: "m3", name: "Veg Fried Rice", price: 120, category: "Main Course", isVeg: true, prepTime: 10, rating: 4.0, description: "Wok-tossed rice with seasonal vegetables", available: true },
  { id: "m4", name: "Masala Chai", price: 30, category: "Beverage", isVeg: true, prepTime: 3, rating: 4.3, description: "Freshly brewed tea with ginger and cardamom", available: true },
  { id: "m5", name: "Samosa (2 pcs)", price: 40, category: "Snacks", isVeg: true, prepTime: 5, rating: 4.2, description: "Crispy pastry filled with spiced potato and peas", available: true },
  { id: "m6", name: "Gulab Jamun", price: 60, category: "Dessert", isVeg: true, prepTime: 5, rating: 4.6, description: "Soft milk dumplings soaked in rose sugar syrup", available: true },
];

const menu_railway_dhaba: MenuItem[] = [
  { id: "m7", name: "Rajma Chawal", price: 130, category: "Main Course", isVeg: true, prepTime: 12, rating: 4.1, description: "Hearty kidney bean curry with steamed rice", available: true },
  { id: "m8", name: "Chicken Biryani", price: 200, category: "Main Course", isVeg: false, prepTime: 20, rating: 4.4, description: "Slow-cooked chicken biryani with caramelized onions and mint", available: true },
  { id: "m9", name: "Aloo Paratha", price: 80, category: "Breakfast", isVeg: true, prepTime: 8, rating: 4.3, description: "Whole-wheat flatbread stuffed with spiced potato filling", available: true },
  { id: "m10", name: "Lassi", price: 50, category: "Beverage", isVeg: true, prepTime: 3, rating: 4.5, description: "Chilled yogurt drink, plain or sweet", available: true },
  { id: "m11", name: "Kachori", price: 35, category: "Snacks", isVeg: true, prepTime: 5, rating: 4.0, description: "Deep-fried puri stuffed with spiced lentils", available: true },
  { id: "m12", name: "Egg Curry Rice", price: 140, category: "Main Course", isVeg: false, prepTime: 12, rating: 4.2, description: "Boiled eggs simmered in tangy onion-tomato gravy", available: true },
];

const menu_annapurna: MenuItem[] = [
  { id: "m13", name: "Dal Makhani Thali", price: 160, category: "Main Course", isVeg: true, prepTime: 15, rating: 4.8, description: "Creamy black lentils with naan, rice, and raita", available: true },
  { id: "m14", name: "Chole Bhature", price: 110, category: "Breakfast", isVeg: true, prepTime: 10, rating: 4.6, description: "Spicy chickpea curry with fluffy deep-fried bread", available: true },
  { id: "m15", name: "Cold Coffee", price: 60, category: "Beverage", isVeg: true, prepTime: 5, rating: 4.4, description: "Blended chilled coffee with milk and ice cream", available: true },
  { id: "m16", name: "Bread Pakora", price: 45, category: "Snacks", isVeg: true, prepTime: 7, rating: 4.1, description: "Battered bread slices deep-fried to golden perfection", available: true },
  { id: "m17", name: "Mutton Biryani", price: 280, category: "Main Course", isVeg: false, prepTime: 25, rating: 4.9, description: "Slow-cooked tender mutton with saffron-infused basmati", available: true },
  { id: "m18", name: "Mishti Doi", price: 50, category: "Dessert", isVeg: true, prepTime: 3, rating: 4.7, description: "Traditional Bengali sweetened yogurt", available: true },
];

const menu_desi_tadka: MenuItem[] = [
  { id: "m19", name: "Shahi Paneer", price: 170, category: "Main Course", isVeg: true, prepTime: 18, rating: 4.3, description: "Royal cottage cheese in creamy cashew gravy", available: true },
  { id: "m20", name: "Fish Fry", price: 160, category: "Snacks", isVeg: false, prepTime: 12, rating: 4.2, description: "Crispy spiced fish fillets with green chutney", available: true },
  { id: "m21", name: "Mango Lassi", price: 65, category: "Beverage", isVeg: true, prepTime: 3, rating: 4.8, description: "Thick mango and yogurt smoothie", available: true },
  { id: "m22", name: "Poha", price: 60, category: "Breakfast", isVeg: true, prepTime: 7, rating: 4.0, description: "Flattened rice with mustard seeds, peanuts, and curry leaves", available: true },
];

const menu_shg_priya: MenuItem[] = [
  { id: "m23", name: "Idli Sambar (4 pcs)", price: 80, category: "Breakfast", isVeg: true, prepTime: 8, rating: 4.5, description: "Steamed rice cakes with aromatic lentil soup", available: true },
  { id: "m24", name: "Medu Vada", price: 60, category: "Breakfast", isVeg: true, prepTime: 8, rating: 4.4, description: "Crispy lentil fritters with coconut chutney", available: true },
  { id: "m25", name: "Upma", price: 70, category: "Breakfast", isVeg: true, prepTime: 10, rating: 4.1, description: "Savory semolina with vegetables and cashews", available: true },
  { id: "m26", name: "Filter Coffee", price: 40, category: "Beverage", isVeg: true, prepTime: 4, rating: 4.7, description: "Strong South Indian coffee with frothy milk", available: true },
  { id: "m27", name: "Rava Kesari", price: 55, category: "Dessert", isVeg: true, prepTime: 5, rating: 4.6, description: "Semolina sweet with saffron and cashews", available: true },
];

const menu_mumbai_express: MenuItem[] = [
  { id: "m28", name: "Vada Pav", price: 40, category: "Snacks", isVeg: true, prepTime: 5, rating: 4.5, description: "Mumbai's iconic spiced potato fritter in bread bun", available: true },
  { id: "m29", name: "Pav Bhaji", price: 100, category: "Main Course", isVeg: true, prepTime: 10, rating: 4.6, description: "Spiced vegetable mash with buttery bread rolls", available: true },
  { id: "m30", name: "Misal Pav", price: 90, category: "Breakfast", isVeg: true, prepTime: 10, rating: 4.4, description: "Spicy sprouted beans curry with bread rolls", available: true },
  { id: "m31", name: "Kokum Sharbat", price: 35, category: "Beverage", isVeg: true, prepTime: 2, rating: 4.2, description: "Traditional Konkan cooler with kokum and spices", available: true },
  { id: "m32", name: "Chicken Frankie", price: 120, category: "Snacks", isVeg: false, prepTime: 8, rating: 4.3, description: "Spiced chicken roll wrapped in thin wheat crepe", available: true },
];

const menu_bengal_kitchen: MenuItem[] = [
  { id: "m33", name: "Kathi Roll", price: 100, category: "Snacks", isVeg: false, prepTime: 10, rating: 4.4, description: "Egg and chicken wrapped in flaky paratha", available: true },
  { id: "m34", name: "Fish Curry Rice", price: 180, category: "Main Course", isVeg: false, prepTime: 15, rating: 4.6, description: "Hilsa fish in mustard gravy with steamed rice", available: true },
  { id: "m35", name: "Darjeeling Tea", price: 45, category: "Beverage", isVeg: true, prepTime: 3, rating: 4.8, description: "Premium first-flush Darjeeling tea", available: true },
  { id: "m36", name: "Rasgulla", price: 60, category: "Dessert", isVeg: true, prepTime: 3, rating: 4.9, description: "Spongy cottage cheese balls in light sugar syrup", available: true },
  { id: "m37", name: "Momos (6 pcs)", price: 90, category: "Snacks", isVeg: false, prepTime: 12, rating: 4.5, description: "Steamed dumplings with ginger-chili dipping sauce", available: true },
];

const menu_rajasthan_swad: MenuItem[] = [
  { id: "m38", name: "Dal Baati Churma", price: 200, category: "Main Course", isVeg: true, prepTime: 20, rating: 4.7, description: "Rajasthani baked wheat balls with spiced lentils and sweet crumble", available: true },
  { id: "m39", name: "Laal Maas", price: 250, category: "Main Course", isVeg: false, prepTime: 25, rating: 4.8, description: "Fiery Rajasthani red mutton curry", available: true },
  { id: "m40", name: "Pyaaz Kachori", price: 50, category: "Snacks", isVeg: true, prepTime: 5, rating: 4.5, description: "Flaky pastry stuffed with spiced onion filling", available: true },
  { id: "m41", name: "Chaas", price: 30, category: "Beverage", isVeg: true, prepTime: 2, rating: 4.3, description: "Spiced buttermilk with cumin and coriander", available: true },
  { id: "m42", name: "Ghevar", price: 80, category: "Dessert", isVeg: true, prepTime: 5, rating: 4.6, description: "Traditional Rajasthani honey-soaked disc dessert", available: true },
];

// ─── Vendors ──────────────────────────────────────────────────────────────────
export function createInitialVendors(): Vendor[] {
  return [
    { id: "v1", name: "Shree Sai Tiffin", station: "Lucknow", stationCode: "LKO", password: "vendor123", hygieneRating: 4.2, hygieneScore: 87, fssaiNumber: "10019022001", fssaiVerified: true, earnings: 0, complaintCount: 0, flagged: false, menu: menu_sai, cuisine: ["North Indian", "Mughlai"], isSHG: false, avgDeliveryTime: 12, totalOrders: 248, approved: true },
    { id: "v2", name: "Railway Dhaba", station: "Kanpur Central", stationCode: "CNB", password: "vendor123", hygieneRating: 3.5, hygieneScore: 62, fssaiNumber: "10019022002", fssaiVerified: true, earnings: 0, complaintCount: 1, flagged: false, menu: menu_railway_dhaba, cuisine: ["North Indian", "Punjabi"], isSHG: false, avgDeliveryTime: 15, totalOrders: 189, approved: true },
    { id: "v3", name: "Annapurna Kitchen", station: "Varanasi Junction", stationCode: "BSB", password: "vendor123", hygieneRating: 4.6, hygieneScore: 92, fssaiNumber: "10019022003", fssaiVerified: true, earnings: 0, complaintCount: 0, flagged: false, menu: menu_annapurna, cuisine: ["North Indian", "Bengali"], isSHG: false, avgDeliveryTime: 10, totalOrders: 412, approved: true },
    { id: "v4", name: "Desi Tadka", station: "Prayagraj Junction", stationCode: "ALD", password: "vendor123", hygieneRating: 3.8, hygieneScore: 75, fssaiNumber: "10019022004", fssaiVerified: false, earnings: 0, complaintCount: 2, flagged: false, menu: menu_desi_tadka, cuisine: ["North Indian"], isSHG: false, avgDeliveryTime: 18, totalOrders: 97, approved: true },
    { id: "v5", name: "Priya SHG Catering", station: "Chennai Central", stationCode: "MAS", password: "vendor123", hygieneRating: 4.4, hygieneScore: 89, fssaiNumber: "10019055010", fssaiVerified: true, earnings: 0, complaintCount: 0, flagged: false, menu: menu_shg_priya, cuisine: ["South Indian"], isSHG: true, avgDeliveryTime: 10, totalOrders: 331, approved: true },
    { id: "v6", name: "Mumbai Express Bites", station: "Mumbai Central", stationCode: "BCT", password: "vendor123", hygieneRating: 4.3, hygieneScore: 84, fssaiNumber: "10019033021", fssaiVerified: true, earnings: 0, complaintCount: 0, flagged: false, menu: menu_mumbai_express, cuisine: ["Maharashtrian", "Street Food"], isSHG: false, avgDeliveryTime: 8, totalOrders: 528, approved: true },
    { id: "v7", name: "Bengal Kitchen", station: "Howrah Junction", stationCode: "HWH", password: "vendor123", hygieneRating: 4.5, hygieneScore: 90, fssaiNumber: "10019044005", fssaiVerified: true, earnings: 0, complaintCount: 1, flagged: false, menu: menu_bengal_kitchen, cuisine: ["Bengali", "East Indian"], isSHG: false, avgDeliveryTime: 12, totalOrders: 376, approved: true },
    { id: "v8", name: "Rajasthan Swad SHG", station: "Jaipur", stationCode: "JP", password: "vendor123", hygieneRating: 4.7, hygieneScore: 94, fssaiNumber: "10019066030", fssaiVerified: true, earnings: 0, complaintCount: 0, flagged: false, menu: menu_rajasthan_swad, cuisine: ["Rajasthani"], isSHG: true, avgDeliveryTime: 14, totalOrders: 193, approved: true },
  ];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const COMPLAINT_REASONS = [
  "Food was cold",
  "Wrong item delivered",
  "Poor hygiene",
  "Overpriced",
  "Delivery late",
  "Packaging damaged",
  "Quantity insufficient",
  "Food was stale",
];

export function calculateRevenueSplit(total: number) {
  const platform = Math.round(total * 0.08);
  const irctc = Math.round(total * 0.02);
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

export const MOCK_PNRS: Record<string, { trainName: string; trainNumber: string; coach: string; seat: string; stations: string[] }> = {
  "2847501234": { trainName: "Mumbai Rajdhani", trainNumber: "12951", coach: "A1", seat: "32", stations: ["Bhopal Junction", "Nagpur Junction", "Mumbai Central"] },
  "3921847563": { trainName: "Howrah Rajdhani", trainNumber: "12301", coach: "B2", seat: "15", stations: ["Kanpur Central", "Prayagraj Junction", "Varanasi Junction", "Howrah Junction"] },
  "4851209371": { trainName: "Karnataka Express", trainNumber: "12627", coach: "S4", seat: "67", stations: ["Bhopal Junction", "Hyderabad Deccan", "Bangalore City"] },
  "5763920184": { trainName: "Tamil Nadu Express", trainNumber: "12621", coach: "SL", seat: "42", stations: ["Nagpur Junction", "Chennai Central"] },
  "1234567890": { trainName: "Jaipur Shatabdi", trainNumber: "12985", coach: "CC", seat: "12", stations: ["Jaipur"] },
};