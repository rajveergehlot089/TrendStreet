"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Shield,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/context/StoreContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItemsCount, wishlist, setIsCartOpen } = useStore();
  const { isAuthenticated } = useAdminAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("USD ($)");
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Track scroll for sticky luxury header refinement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Collection", href: "/shop" },
    { label: "Tailoring", href: "/shop?category=Tailoring+%26+Suits" },
    { label: "Outerwear", href: "/shop?category=Outerwear+%26+Coats" },
    { label: "Footwear", href: "/shop?category=Footwear" },
    { label: "Editorial", href: "/lookbook" },
    { label: "Atelier", href: "/about" },
  ];

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-espresso text-ivory text-[11px] uppercase tracking-[0.2em] py-2 px-4 border-b border-burgundy-900/40 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gold flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-gold" /> VIP Atelier
            </span>
            <span className="text-ivory/70">Complimentary Alterations & Monogramming</span>
          </div>

          <div className="text-center w-full md:w-auto font-medium text-ivory/90">
            Complimentary VIP Courier On Orders Over $200
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group cursor-pointer text-ivory/80 hover:text-gold transition-colors flex items-center gap-1">
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3" />
              <div className="absolute right-0 top-full mt-1 bg-espresso border border-burgundy/40 shadow-xl rounded py-1 px-2 hidden group-hover:block z-50 min-w-[90px]">
                {["USD ($)", "GBP (£)", "EUR (€)"].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className="block w-full text-left py-1 text-[10px] hover:text-gold text-ivory"
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/admin"
              className="text-ivory/70 hover:text-gold flex items-center gap-1 transition-colors text-[10px]"
              title="Admin Portal"
            >
              <Shield className="w-3 h-3 text-gold" />
              {isAuthenticated ? "Admin Active" : "Admin"}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-md py-2 border-b border-burgundy/15"
            : "bg-ivory py-4 border-b border-burgundy/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between min-h-[58px]">
            {/* Left Nav (Desktop) / Mobile Toggle */}
            <div className="flex items-center space-x-6 z-10">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-burgundy hover:text-crimson transition-colors"
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-drawer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <nav className="hidden lg:flex items-center space-x-7">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`text-xs font-semibold uppercase tracking-[0.16em] transition-colors relative py-1 ${
                        isActive
                          ? "text-crimson font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-crimson"
                          : "text-espresso/90 hover:text-crimson"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* CENTER LOGO (Mobile & Desktop - Absolute Optical Center) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center text-center py-1 z-10 pointer-events-auto">
              <Logo
                variant="burgundy"
                size={isScrolled ? "sm" : "md"}
                showTagline={!isScrolled}
                href="/"
              />
            </div>

            {/* Right Icons: Search, Wishlist, Bag, Profile */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-5 z-10">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-burgundy hover:text-crimson transition-colors relative group"
                aria-label="Search Collection"
              >
                <Search className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/saved"
                className="p-2 text-burgundy hover:text-crimson transition-colors relative group"
                aria-label="Saved Wishlist"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-crimson text-ivory text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {wishlist.length}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>

              {/* Shopping Bag Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-burgundy hover:text-crimson transition-colors relative group"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-burgundy text-gold font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </button>

              {/* User Profile */}
              <Link
                href="/profile"
                className="hidden sm:inline-flex p-2 text-burgundy hover:text-crimson transition-colors"
                aria-label="My Account"
                title="Sartorial Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Admin Portal Direct Access Button */}
              <Link
                href="/admin"
                className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-wider uppercase transition-all ${
                  isAuthenticated
                    ? "bg-burgundy text-gold border border-gold/40 shadow-sm"
                    : "border border-burgundy/30 text-burgundy hover:bg-burgundy hover:text-ivory"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-gold" />
                <span>{isAuthenticated ? "Admin Portal" : "Sign In"}</span>
              </Link>
            </div>
          </div>

          {/* Expandable Search Drawer */}
          {isSearchOpen && (
            <div className="mt-3 pt-3 border-t border-burgundy/10 pb-2 transition-all">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    setIsSearchOpen(false);
                  }
                }}
                className="relative flex items-center"
              >
                <Search className="absolute left-4 w-5 h-5 text-burgundy/50" />
                <input
                  type="text"
                  placeholder="Search Savile Row Tailoring, Tuscan Suede, Silk Shirts, Goodyear Oxfords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-ivory-dark pl-12 pr-28 py-3 text-sm rounded border border-burgundy/20 text-espresso placeholder-espresso/50 focus:outline-none focus:border-burgundy"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-burgundy hover:bg-crimson text-ivory text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Explore
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Sartorial Navigation Drawer"
            className="lg:hidden fixed inset-0 top-[73px] bg-espresso/60 backdrop-blur-sm z-50"
          >
            <div className="bg-ivory w-4/5 max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-burgundy/20">
              <div className="space-y-6">
                <div className="pb-4 border-b border-burgundy/15 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-burgundy">
                    Sartorial Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-burgundy"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-base font-semibold uppercase tracking-widest text-espresso hover:text-crimson transition-colors flex items-center justify-between py-2 border-b border-ivory-dark"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 text-burgundy/40" />
                    </Link>
                  ))}
                </nav>

                <div className="pt-4 space-y-3">
                  <Link
                    href="/saved"
                    className="flex items-center space-x-3 text-sm font-medium text-espresso py-1"
                  >
                    <Heart className="w-4 h-4 text-crimson" />
                    <span>Saved Wishlist ({wishlist.length})</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 text-sm font-medium text-espresso py-1"
                  >
                    <User className="w-4 h-4 text-burgundy" />
                    <span>My Sartorial Profile</span>
                  </Link>

                  <Link
                    href="/admin"
                    className="flex items-center space-x-3 text-sm font-medium text-espresso py-1"
                  >
                    <Shield className="w-4 h-4 text-gold" />
                    <span>{isAuthenticated ? "Admin Dashboard (Sujal)" : "Admin Portal"}</span>
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-burgundy/15 text-xs text-espresso/70 space-y-2">
                <p className="font-semibold text-burgundy uppercase tracking-wider">
                  Trend Street Concierge
                </p>
                <p>Private Alterations & Stylist: +44 20 7946 0912</p>
                <p>concierge@trendstreet.com</p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
