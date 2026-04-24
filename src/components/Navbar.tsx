import { Link, useLocation } from "react-router-dom";
import { Train, Menu, X, Sun, Moon, ShoppingCart, Bell, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useApp } from "@/store/AppContext";
import { useCartStore } from "@/store/cartStore";

const NAV_LINKS = [
  { label: "Order Food", href: "/passenger" },
  { label: "Track Order", href: "/tracking" },
  { label: "Vendors", href: "/vendor" },
  { label: "SHG Portal", href: "/shg" },
  { label: "Admin", href: "/admin" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-black/5 dark:shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all duration-300">
              <Train className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">RailBite</span>
              <span className="font-display font-bold text-xs text-orange-500 uppercase tracking-widest mt-0.5">Bharat</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-accent/15 text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800 transition-all group shrink-0"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5 text-slate-500 group-hover:text-orange-500 transition-colors shrink-0" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background animate-scale-in shrink-0">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800 transition-all group shrink-0"
              aria-label="Toggle theme"
            >
              {theme === "dark"
                ? <Sun className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-orange-500" />
                : <Moon className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-orange-500" />
              }
            </button>

            {/* Login button */}
            <Link
              to="/login"
              className="hidden sm:flex items-center justify-center px-6 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-md hover:shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-[0.98] transition-all shrink-0"
            >
              Login
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800 transition-all shrink-0"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5 shrink-0" /> : <Menu className="h-5 w-5 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass border-t border-border animate-fade-in">
          <nav className="container mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-accent/15 text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-3 rounded-xl gradient-saffron text-white text-sm font-semibold text-center"
            >
              Login / Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}