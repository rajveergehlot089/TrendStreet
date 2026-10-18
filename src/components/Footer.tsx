"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Scissors,
  Mail,
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Award,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-espresso text-ivory pt-16 pb-12 border-t border-burgundy/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust & Craftsmanship Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-14 border-b border-burgundy/30">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-burgundy/40 rounded-full text-gold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ivory">
                Global Express Delivery
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                Complimentary VIP courier shipping on all orders over $200 worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-burgundy/40 rounded-full text-gold">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ivory">
                Savile Row Alterations
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                Complimentary sleeve and trouser hem alterations on all tailored garments.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-burgundy/40 rounded-full text-gold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ivory">
                30-Day Atelier Return
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                Hassle-free worldwide returns and exchanges with prepaid return courier.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-burgundy/40 rounded-full text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ivory">
                Certified Noble Provenance
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                100% genuine Vitale Barberis, Thomas Mason, and Mongolian cashmere fibers.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-14 border-b border-burgundy/30">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-start">
              <Logo variant="ivory" size="lg" href="/" />
            </div>
            <p className="text-xs text-ivory/75 leading-relaxed max-w-sm">
              Trend Street is the definitive digital style hub for the modern gentleman. Cut from
              natural European noble fibers and finished with bespoke Savile Row precision.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-burgundy/50 hover:bg-crimson flex items-center justify-center text-ivory transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-burgundy/50 hover:bg-crimson flex items-center justify-center text-ivory transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-burgundy/50 hover:bg-crimson flex items-center justify-center text-ivory transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links: Collections */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-ivory/80">
              <li>
                <Link href="/shop?category=Oversized" className="hover:text-gold transition-colors">
                  Oversized Silhouettes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Jeans" className="hover:text-gold transition-colors">
                  Selvedge & Baggy Jeans
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Boxy+Fit" className="hover:text-gold transition-colors">
                  Boxy Fit Essentials
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Jackets" className="hover:text-gold transition-colors">
                  Structural Jackets
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-gold transition-colors">
                  Editorial Lookbook
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier & Heritage */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              The Atelier
            </h5>
            <ul className="space-y-2 text-xs text-ivory/80">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Brand Heritage
                </Link>
              </li>
              <li>
                <Link href="/about#craftsmanship" className="hover:text-gold transition-colors">
                  Sartorial Craftsmanship
                </Link>
              </li>
              <li>
                <Link href="/about#mills" className="hover:text-gold transition-colors">
                  Italian & British Mills
                </Link>
              </li>
              <li>
                <Link href="/about#sustainability" className="hover:text-gold transition-colors">
                  Sustainability Pledge
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-gold transition-colors">
                  Client Profile
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold text-gold/80 transition-colors">
                  Atelier Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* VIP Sartorial Club Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gold" /> The Trend Street Club
            </h5>
            <p className="text-xs text-ivory/75 leading-relaxed">
              Subscribe for private access to seasonal trunk shows, private bespoke appointments, and
              receive an exclusive 10% welcome voucher code.
            </p>

            {subscribed ? (
              <div className="p-3 bg-burgundy/60 border border-gold/30 rounded text-xs text-gold">
                ✨ Thank you for subscribing. Use code <span className="font-bold text-ivory">TREND10</span> at checkout for 10% off your first order!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-ivory/50" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-burgundy/30 border border-burgundy/60 rounded pl-10 pr-28 py-2.5 text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 px-4 py-1.5 bg-burgundy hover:bg-crimson text-ivory text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                  >
                    Join
                  </button>
                </div>
                <p className="text-[10px] text-ivory/50">
                  By joining, you agree to receive sartorial updates. You may opt out anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory/60 gap-4">
          <p>© 2026 Trend Street — The Style Hub. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility (WCAG 2.1 AA)</span>
            <span>Security Statement</span>
            <Link href="/admin/login" className="hover:text-gold transition-colors">
              Admin Login (sujal@.com)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
