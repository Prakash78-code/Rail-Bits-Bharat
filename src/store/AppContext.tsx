import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  type AppState, type Order, type Complaint, type Vendor,
  createInitialVendors, calculateRevenueSplit, generateQR, generateOrderId,
  type MenuItem,
} from "@/data/mockData";

interface AppContextType {
  state: AppState;
  placeOrder: any;
  updateOrderStatus: any;
  submitComplaint: any;
  rateOrder: any;
  getVendor: any;
  getVendorOrders: any;
  getTotalRevenue: any;

  // 🛒 IMPORTANT FIX
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {

  const [state, setState] = useState<AppState>({
    vendors: createInitialVendors(),
    orders: [],
    complaints: [],
    jobs: { vendors: 5, delivery: 8, kitchen: 3, hygiene: 2 },

    // 🛒 FIX: CART ADD
    cart: [],
  });

  // 🛒 FIX: CLEAR CART FUNCTION
  const clearCart = useCallback(() => {
    setState((s) => ({
      ...s,
      cart: [],
    }));
  }, []);

  const placeOrder = useCallback((pnr: string, trainName: string, station: string, vendorId: string, items: { item: MenuItem; qty: number }[]) => {
    const total = items.reduce((sum, i) => sum + i.item.price * i.qty, 0);

    const order: Order = {
      id: generateOrderId(),
      pnr,
      trainName,
      station,
      vendorId,
      items,
      total,
      status: "placed",
      qrCode: generateQR(),
      eta: 10,
      createdAt: Date.now(),
      rated: false,
      revenueSplit: calculateRevenueSplit(total),
    };

    setState((s) => ({
      ...s,
      orders: [...s.orders, order],
    }));

    return order;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map(o => o.id === orderId ? { ...o, status } : o),
    }));
  }, []);

  const submitComplaint = useCallback(() => {}, []);
  const rateOrder = useCallback(() => {}, []);

  const getVendor = useCallback((id: string) =>
    state.vendors.find(v => v.id === id),
    [state.vendors]
  );

  const getVendorOrders = useCallback((vendorId: string) =>
    state.orders.filter(o => o.vendorId === vendorId),
    [state.orders]
  );

  const getTotalRevenue = useCallback(() => ({
    vendor: 0,
    platform: 0,
    irctc: 0,
    maintenance: 0,
    total: 0,
  }), []);

  return (
    <AppContext.Provider value={{
      state,
      placeOrder,
      updateOrderStatus,
      submitComplaint,
      rateOrder,
      getVendor,
      getVendorOrders,
      getTotalRevenue,
      clearCart, // ✅ FIX HERE
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}