import { createContext, useContext, useReducer, ReactNode } from "react";
import {
  AppState, Order, Complaint, MenuItem,
  createInitialVendors, calculateRevenueSplit,
  generateQR, generateOrderId,
} from "@/data/mockData";

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState: AppState = {
  vendors: createInitialVendors(),
  orders: [],
  complaints: [],
  jobs: { vendors: 8, delivery: 24, kitchen: 16, hygiene: 6 },
};

// ─── Actions ───────────────────────────────────────────────────────────────────
type Action =
  | { type: "PLACE_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; orderId: string; status: Order["status"] }
  | { type: "RATE_ORDER"; orderId: string; vendorId: string; taste: number; hygiene: number; delivery: number }
  | { type: "SUBMIT_COMPLAINT"; payload: Complaint }
  | { type: "FLAG_VENDOR"; vendorId: string }
  | { type: "UPDATE_VENDOR_EARNINGS"; vendorId: string; amount: number }
  | { type: "INCREMENT_JOBS" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "PLACE_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        vendors: state.vendors.map(v =>
          v.id === action.payload.vendorId
            ? { ...v, totalOrders: v.totalOrders + 1 }
            : v
        ),
      };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.orderId ? { ...o, status: action.status } : o
        ),
      };
    case "RATE_ORDER": {
      const avgRating = (action.taste + action.hygiene + action.delivery) / 3;
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.orderId ? { ...o, rated: true } : o
        ),
        vendors: state.vendors.map(v =>
          v.id === action.vendorId
            ? { ...v, hygieneRating: Math.round(((v.hygieneRating * 0.9) + (avgRating * 0.1)) * 10) / 10 }
            : v
        ),
      };
    }
    case "SUBMIT_COMPLAINT":
      return {
        ...state,
        complaints: [action.payload, ...state.complaints],
        vendors: state.vendors.map(v =>
          v.id === action.payload.vendorId
            ? { ...v, complaintCount: v.complaintCount + 1, flagged: v.complaintCount + 1 >= 3 }
            : v
        ),
      };
    case "FLAG_VENDOR":
      return {
        ...state,
        vendors: state.vendors.map(v =>
          v.id === action.vendorId ? { ...v, flagged: !v.flagged } : v
        ),
      };
    case "UPDATE_VENDOR_EARNINGS":
      return {
        ...state,
        vendors: state.vendors.map(v =>
          v.id === action.vendorId ? { ...v, earnings: v.earnings + action.amount } : v
        ),
      };
    case "INCREMENT_JOBS":
      return { ...state, jobs: { ...state.jobs, delivery: state.jobs.delivery + 1 } };
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  placeOrder: (
    pnr: string, trainName: string, trainNumber: string,
    station: string, coach: string, seat: string,
    vendorId: string, cart: { item: MenuItem; qty: number }[],
    paymentMethod?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  rateOrder: (orderId: string, vendorId: string, taste: number, hygiene: number, delivery: number) => void;
  submitComplaint: (orderId: string, vendorId: string, reasons: string[], text: string) => void;
  flagVendor: (vendorId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function placeOrder(
    pnr: string, trainName: string, trainNumber: string,
    station: string, coach: string, seat: string,
    vendorId: string, cart: { item: MenuItem; qty: number }[],
    paymentMethod = "UPI"
  ): Order {
    const total = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
    const vendor = state.vendors.find(v => v.id === vendorId);
    const order: Order = {
      id: generateOrderId(),
      pnr, trainName, trainNumber,
      station, coach, seat, vendorId,
      items: cart,
      total,
      status: "placed",
      qrCode: generateQR(),
      eta: (vendor?.avgDeliveryTime ?? 15) * 60,
      createdAt: Date.now(),
      rated: false,
      paymentMethod,
      revenueSplit: calculateRevenueSplit(total),
    };
    dispatch({ type: "PLACE_ORDER", payload: order });
    return order;
  }

  function updateOrderStatus(orderId: string, status: Order["status"]) {
    dispatch({ type: "UPDATE_ORDER_STATUS", orderId, status });
  }

  function rateOrder(orderId: string, vendorId: string, taste: number, hygiene: number, delivery: number) {
    dispatch({ type: "RATE_ORDER", orderId, vendorId, taste, hygiene, delivery });
  }

  function submitComplaint(orderId: string, vendorId: string, reasons: string[], text: string) {
    const complaint: Complaint = {
      id: `CMP-${Date.now().toString(36).toUpperCase()}`,
      orderId, vendorId, reasons, text,
      createdAt: Date.now(),
      status: "open",
      priority: reasons.length >= 3 ? "high" : reasons.length >= 2 ? "medium" : "low",
    };
    dispatch({ type: "SUBMIT_COMPLAINT", payload: complaint });
  }

  function flagVendor(vendorId: string) {
    dispatch({ type: "FLAG_VENDOR", vendorId });
  }

  return (
    <AppContext.Provider value={{ state, placeOrder, updateOrderStatus, rateOrder, submitComplaint, flagVendor }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}