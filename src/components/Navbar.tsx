import { Link, useLocation, useNavigate } from "react-router-dom";
import { Train, User, ChefHat, Shield, Home, Menu, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/menu", label: "Menu", icon: Menu },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/passenger", label: "Passenger", icon: User },
  { to: "/vendor", label: "Vendor", icon: ChefHat },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Train className="h-6 w-6 text-accent" />
          RailBite Bharat
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-2">

          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}>
              <Icon className="h-5 w-5" />
            </Link>
          ))}

          {/* 🔥 AUTH BUTTONS */}
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-3 py-1 rounded">
                Login
              </Link>
              <Link to="/signup" className="bg-green-500 text-white px-3 py-1 rounded">
                Signup
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}