import { Link, useLocation, useNavigate } from "react-router-dom";
import { Train, User, ChefHat, Shield, Home, Menu, ShoppingCart, LogOut, Moon, Sun,
} from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/", icon: Home },
  { to: "/menu", icon: Menu },
  { to: "/cart", icon: ShoppingCart },
  { to: "/passenger", icon: User },
  { to: "/vendor", icon: ChefHat },
  { to: "/admin", icon: Shield },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dark, setDark] = useState(false);

  // 🌙 Dark Mode toggle
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-black dark:text-white">
          <Train className="h-6 w-6 text-blue-500" />
          RailBite
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-3">

          {/* Icons */}
          {navItems.map(({ to, icon: Icon }) => (
            <Link key={to} to={to}>
              <Icon
                className={`h-5 w-5 transition-all ${
                  location.pathname === to
                    ? "text-blue-500 scale-110"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              />
            </Link>
          ))}

          {/* 🌙 Dark Mode */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {dark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* 🔐 AUTH */}
          {user ? (
            <>
              <span className="text-sm hidden md:block text-black dark:text-white">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 transition-all text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-3 py-1 rounded"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 hover:bg-green-600 transition-all text-white px-3 py-1 rounded"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}