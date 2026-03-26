import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  type AppState, type Order, type Complaint, type Vendor,
  createInitialVendors, calculateRevenueSplit, generateQR, generateOrderId,
  type MenuItem,
} from "@/data/mockData";

interface AppContextType {
  state: AppState;
  placeOrder: (pnr: string, trainName: string, station: string, vendorId: string, items: { item: MenuItem; qty: number }[]) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  submitComplaint: (orderId: string, vendorId: string, reasons: string[], text: string) => void;
  rateOrder: (orderId: string, taste: number, hygiene: number, delivery: number) => void;
  getVendor: (id: string) => Vendor | undefined;
  getVendorOrders: (vendorId: string) => Order[];
  getTotalRevenue: () => { vendor: number; platform: number; irctc: number; maintenance: number; total: number };
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    vendors: createInitialVendors(),
    orders: [],
    complaints: [],
    jobs: { vendors: 5, delivery: 8, kitchen: 3, hygiene: 2 },
  });

  const placeOrder = useCallback((pnr: string, trainName: string, station: string, vendorId: string, items: { item: MenuItem; qty: number }[]) => {
    const total = items.reduce((sum, i) => sum + i.item.price * i.qty, 0);
    const order: Order = {
      id: generateOrderId(),
      pnr, trainName, station, vendorId, items, total,
      status: "placed",
      qrCode: generateQR(),
      eta: 10 + Math.floor(Math.random() * 20),
      createdAt: Date.now(),
      rated: false,
      revenueSplit: calculateRevenueSplit(total),
    };
    setState((s) => ({
      ...s,
      orders: [...s.orders, order],
      vendors: s.vendors.map((v) => v.id === vendorId ? { ...v, earnings: v.earnings + order.revenueSplit.vendor } : v),
    }));
    return order;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => o.id === orderId ? { ...o, status } : o),
    }));
  }, []);

  const submitComplaint = useCallback((orderId: string, vendorId: string, reasons: string[], text: string) => {
    const complaint: Complaint = {
      id: `CMP-${Date.now()}`,
      orderId, vendorId, reasons, text,
      createdAt: Date.now(),
    };
    setState((s) => {
      const newComplaints = [...s.complaints, complaint];
      const vendorComplaints = newComplaints.filter((c) => c.vendorId === vendorId).length;
      return {
        ...s,
        complaints: newComplaints,
        vendors: s.vendors.map((v) => {
          if (v.id !== vendorId) return v;
          const newCount = v.complaintCount + 1;
          return {
            ...v,
            complaintCount: newCount,
            hygieneRating: Math.max(1, v.hygieneRating - 0.3),
            flagged: newCount >= 3 || vendorComplaints >= 3,
          };
        }),
      };
    });
  }, []);

  const rateOrder = useCallback((orderId: string, taste: number, hygiene: number, delivery: number) => {
    setState((s) => {
      const order = s.orders.find((o) => o.id === orderId);
      if (!order) return s;
      const avg = (taste + hygiene + delivery) / 3;
      return {
        ...s,
        orders: s.orders.map((o) => o.id === orderId ? { ...o, rated: true } : o),
        vendors: s.vendors.map((v) => {
          if (v.id !== order.vendorId) return v;
          return { ...v, hygieneRating: Math.min(5, (v.hygieneRating + avg) / 2) };
        }),
      };
    });
  }, []);

  const getVendor = useCallback((id: string) => state.vendors.find((v) => v.id === id), [state.vendors]);
  const getVendorOrders = useCallback((vendorId: string) => state.orders.filter((o) => o.vendorId === vendorId), [state.orders]);

  const getTotalRevenue = useCallback(() => {
    return state.orders.reduce((acc, o) => ({
      vendor: acc.vendor + o.revenueSplit.vendor,
      platform: acc.platform + o.revenueSplit.platform,
      irctc: acc.irctc + o.revenueSplit.irctc,
      maintenance: acc.maintenance + o.revenueSplit.maintenance,
      total: acc.total + o.total,
    }), { vendor: 0, platform: 0, irctc: 0, maintenance: 0, total: 0 });
  }, [state.orders]);

  return (
    <AppContext.Provider value={{ state, placeOrder, updateOrderStatus, submitComplaint, rateOrder, getVendor, getVendorOrders, getTotalRevenue }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
