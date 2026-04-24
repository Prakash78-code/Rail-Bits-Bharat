import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/store/AppContext";
import { AuthProvider } from "@/store/AuthContext";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";

import Homepage from "./pages/Homepage";
import PassengerPortal from "./pages/PassengerPortal";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSummary from "./pages/OrderSummary";
import OrderTracking from "./pages/OrderTracking";
import DemandForecast from "./pages/DemandForecast";
import VendorRegister from "./pages/VendorRegister";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SHGPortal from "./pages/SHGPortal";
import RateOrderPage from "./pages/RateOrderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AppProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navbar />
              <Routes>
                {/* Public */}
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/shg" element={<SHGPortal />} />
                <Route path="/vendor-register" element={<VendorRegister />} />

                {/* Passenger */}
                <Route path="/passenger" element={<PassengerPortal />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-summary" element={<OrderSummary />} />
                <Route path="/tracking" element={<OrderTracking />} />
                <Route path="/rate" element={<RateOrderPage />} />

                {/* Vendor */}
                <Route path="/vendor" element={<VendorDashboard />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/forecast" element={<DemandForecast />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;