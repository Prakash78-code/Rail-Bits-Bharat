import { Link, useLocation } from "react-router-dom";
import { Train, User, ChefHat, Shield, Home, Menu, ShoppingCart, LogIn, UserPlus, LogOut } from "lucide-react";

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

  // 🔥 Check login
  const token = localStorage.getItem("token");

  // 🔥 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <Train className="h-6 w-6 text-accent" />
          <span>Rail<span className="text-gradient">Bite</span> Bharat</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">

          {/* Main Links */}
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}

          {/* 🔥 AUTH BUTTONS */}
          {!token ? (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>

              {/* Signup */}
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Signup</span>
              </Link>
            </>
          ) : (
            /* 🔥 Logout */
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}