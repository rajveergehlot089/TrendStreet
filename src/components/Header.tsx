"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/context/StoreContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItemsCount, wishlist, setIsCartOpen, siteSettings } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);

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

  // All 4 categories placed side-by-side on the left side
  const navCategories = [
    { label: "Oversized", href: "/oversized" },
    { label: "Jeans", href: "/jeans" },
    { label: "Boxy Fit", href: "/boxy-fit" },
    { label: "Jackets", href: "/jackets" },
  ];

  const allNavLinks = [
    { label: "All Drops", href: "/shop" },
    { label: "Oversized", href: "/oversized" },
    { label: "Jeans", href: "/jeans" },
    { label: "Boxy Fit", href: "/boxy-fit" },
    { label: "Jackets", href: "/jackets" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Heritage", href: "/about" },
  ];

  return (
    <>
      {/* Top Announcement Bar (Configurable in Admin Portal) */}
      {siteSettings?.topAnnouncement?.enabled && !isAnnouncementDismissed && (
        <div className="bg-espresso text-gold py-1.5 px-3 text-center text-[10px] sm:text-xs font-semibold tracking-wider uppercase border-b border-burgundy/30 select-none relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 flex-wrap pr-6">
            <span>{siteSettings.topAnnouncement.text}</span>
            {siteSettings.topAnnouncement.linkUrl && (
              <Link
                href={siteSettings.topAnnouncement.linkUrl}
                className="text-ivory underline hover:text-gold transition-colors font-bold"
              >
                {siteSettings.topAnnouncement.linkText || "Explore"}
              </Link>
            )}
          </div>
          <button
            onClick={() => setIsAnnouncementDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/70 hover:text-gold p-1"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Luxury Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-md py-1.5 sm:py-2 border-b border-burgundy/15"
            : "bg-ivory py-2 sm:py-4 border-b border-burgundy/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[50px] sm:min-h-[58px]">
            {/* Left Nav (All 4 Sections Grouped Side by Side) / Mobile Toggle */}
            <div className="flex-1 flex items-center justify-start space-x-3 sm:space-x-6">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-burgundy hover:text-crimson transition-colors -ml-2"
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-drawer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
                {navCategories.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`text-xs font-bold uppercase tracking-[0.16em] transition-colors relative py-1 ${
                        isActive
                          ? "text-crimson font-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-crimson"
                          : "text-espresso/90 hover:text-crimson"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* CENTER LOGO (Dedicated Isolated Center - Guaranteed No Overlapping) */}
            <div className="flex-shrink-0 flex items-center justify-center px-4">
              <Logo
                variant="burgundy"
                size={isScrolled ? "sm" : "md"}
                href="/"
              />
            </div>

            {/* Right Action Icons */}
            <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-5">
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
                className="p-2 text-burgundy hover:text-crimson transition-colors"
                aria-label="My Account"
                title="Client Profile"
              >
                <User className="w-5 h-5" />
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
                  placeholder="Search Oversized Hoodies, Baggy Jeans, Boxy Knits, Suede Jackets..."
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
            aria-label="Navigation Drawer"
            className="lg:hidden fixed inset-0 top-[73px] bg-espresso/60 backdrop-blur-sm z-50"
          >
            <div className="bg-ivory w-4/5 max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-burgundy/20">
              <div className="space-y-6">
                <div className="pb-4 border-b border-burgundy/15 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-burgundy flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-crimson" />
                    <span>The Silhouettes</span>
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
                  {allNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-base font-bold uppercase tracking-widest text-espresso hover:text-crimson transition-colors flex items-center justify-between py-2 border-b border-ivory-dark"
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
                    <span>Client Profile</span>
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-burgundy/15 text-xs text-espresso/70 space-y-2">
                <p className="font-semibold text-burgundy uppercase tracking-wider">
                  Trend Street Studio
                </p>
                <p>Oversized • Jeans • Boxy Fit • Jackets</p>
                <p>concierge@trendstreet.com</p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
