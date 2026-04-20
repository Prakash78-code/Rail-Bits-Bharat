import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/store/AppContext";
import { AuthProvider } from "@/store/AuthContext";
import { Navbar } from "@/components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import OrderTracking from "./pages/OrderTracking";
import DemandForecast from "./pages/DemandForecast";
import VendorRegister from "./pages/VendorRegister";

import Homepage from "./pages/Homepage";
import PassengerPortal from "./pages/PassengerPortal";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSummary from "./pages/OrderSummary";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import SetPinPage from "./pages/SetPinPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <AuthProvider>

          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Navbar />

            <Routes>
              {/* 🌐 Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* 🔑 Extra Public Route */}
              <Route path="/set-pin" element={<SetPinPage />} />
              <Route path="/vendor-register" element={<VendorRegister />} />

              {/* 🔐 Protected Routes */}
              <Route
                path="/menu"
                element={
                  <ProtectedRoute>
                    <MenuPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order-summary"
                element={
                  <ProtectedRoute>
                    <OrderSummary />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tracking"
                element={
                  <ProtectedRoute>
                    <OrderTracking />
                  </ProtectedRoute>
                }
              />

              {/* 🌤️ AI FORECAST ROUTE (NEW ADDED) */}
              <Route
                path="/forecast"
                element={
                  <ProtectedRoute>
                    <DemandForecast />
                  </ProtectedRoute>
                }
              />

              {/* 👤 Other dashboards */}
              <Route path="/passenger" element={<PassengerPortal />} />
              <Route path="/vendor" element={<VendorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* ❌ 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>

          </BrowserRouter>

        </AuthProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;