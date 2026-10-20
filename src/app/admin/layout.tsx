"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  Package,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronRight,
  Shield,
  Menu,
  X,
  Bell,
  Sliders,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Logo } from "@/components/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, adminName, adminEmail, logout } = useAdminAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on /admin/login, bypass layout wrapper
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Display luxury preloader while verifying credentials to prevent bouncing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Verifying Atelier Privileges...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center p-4">
        <div className="bg-ivory p-8 rounded-2xl text-center space-y-4 max-w-sm">
          <Shield className="w-10 h-10 text-burgundy mx-auto" />
          <h2 className="font-serif text-xl font-bold text-espresso">Admin Authentication Required</h2>
          <p className="text-xs text-espresso/70">
            Please log in with your administrative credentials to access this portal.
          </p>
          <Link
            href="/admin/login"
            className="block w-full py-2.5 bg-burgundy text-gold text-xs font-bold uppercase rounded-lg"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products Catalog (CRUD)", href: "/admin/products", icon: Shirt },
    { label: "Orders Fulfillment", href: "/admin/orders", icon: Package },
    { label: "Site Customizer (Live)", href: "/admin/settings", icon: Sliders },
    { label: "Admin Access Register", href: "/admin/access-register", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-espresso text-ivory p-4 flex items-center justify-between border-b border-burgundy/30">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-gold" />
          <span className="font-serif font-bold text-sm tracking-wider">Trend Street Admin</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-gold"
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-espresso text-ivory p-6 flex flex-col justify-between border-r border-burgundy/40 transform transition-transform duration-300 md:static md:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Portal Identity */}
          <div className="space-y-3 pb-6 border-b border-burgundy/40">
            <Logo variant="ivory" size="sm" showTagline={false} href="/" />
            <div className="flex items-center space-x-2 text-[11px] font-bold text-gold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management Hub</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-burgundy text-gold font-bold shadow-md border border-gold/30"
                      : "text-ivory/80 hover:bg-burgundy/40 hover:text-ivory"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Actions */}
        <div className="space-y-4 pt-6 border-t border-burgundy/40 text-xs">
          <div className="p-3 bg-burgundy/30 rounded-xl border border-burgundy/50 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-burgundy text-gold font-bold flex items-center justify-center border border-gold/40">
              S
            </div>
            <div className="truncate">
              <span className="font-bold text-ivory block truncate">{adminName}</span>
              <span className="text-[10px] text-gold font-mono truncate block">{adminEmail}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 text-ivory/70 hover:text-gold text-xs transition-colors rounded-lg hover:bg-burgundy/30"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Public Store</span>
              </div>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 text-xs transition-colors rounded-lg hover:bg-burgundy/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Administrator</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Working Canvas */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
