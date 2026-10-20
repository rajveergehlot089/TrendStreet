"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Scissors,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Award,
  MapPin,
  Phone,
  FileText,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/context/StoreContext";

export const Footer: React.FC = () => {
  const { siteSettings } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-espresso text-ivory pt-10 sm:pt-16 pb-24 md:pb-12 border-t border-burgundy/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust & Craftsmanship Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 pb-8 sm:pb-14 border-b border-burgundy/30">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-burgundy/40 rounded-full text-gold flex-shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ivory">
                Express India Delivery
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                Complimentary Blue Dart Apex & Delhivery Air courier on all orders over ₹1,999.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-burgundy/40 rounded-full text-gold flex-shrink-0">
              <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ivory">
                Lifetime Seam Care
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                Complimentary selvedge denim chain-stitch hemming and seam reinforcement.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-burgundy/40 rounded-full text-gold flex-shrink-0">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ivory">
                30-Day Doorstep Returns
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                Doorstep reverse pickup across 19,000+ Indian PIN codes with zero return fees.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-burgundy/40 rounded-full text-gold flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ivory">
                Certified Provenance
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                100% authentic Okayama selvedge denim, 520gsm loopback terry, and Tuscan suede.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-14 border-b border-burgundy/30">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-start">
              <Logo variant="ivory" size="lg" href="/" />
            </div>
            <p className="text-xs text-ivory/75 leading-relaxed max-w-sm">
              Trend Street is India&rsquo;s definitive digital style hub for luxury architectural menswear streetwear. Engineered from
              dense custom-milled textiles, Okayama selvedge denim, and finished with immaculate structural precision.
            </p>
            <div className="pt-1 text-[11px] text-ivory/60 space-y-1">
              <p className="font-semibold text-gold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Flagship Atelier: Pali Hill, Bandra West, Mumbai 400050</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold/80" />
                <span>+91 98200 12345 • concierge@trendstreet.in</span>
              </p>
            </div>
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

          {/* Concierge & Legal Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Concierge & Policies
            </h5>
            <ul className="space-y-2 text-xs text-ivory/80">
              <li>
                <Link href="/shipping-policy" className="hover:text-gold transition-colors">
                  Shipping & Express Courier
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold transition-colors">
                  30-Day Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact & Grievance Redressal
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-gold transition-colors">
                  Client Fit Profile & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* VIP Sartorial Club Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gold" /> The Trend Street Club
            </h5>
            <p className="text-xs text-ivory/75 leading-relaxed">
              Subscribe for private access to seasonal drops, trunk show previews, and
              receive an exclusive 10% welcome voucher code for orders over ₹1,999.
            </p>

            {subscribed ? (
              <div className="p-3 bg-burgundy/60 border border-gold/30 rounded-lg text-xs text-gold">
                ✨ Thank you for subscribing. Use code <span className="font-bold text-ivory">TREND10</span> at checkout for 10% off your inaugural order!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-ivory/50" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-burgundy/30 border border-burgundy/60 rounded pl-10 pr-24 py-2.5 text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 px-3.5 py-1.5 bg-burgundy hover:bg-crimson text-ivory text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                  >
                    Join
                  </button>
                </div>
                <p className="text-[10px] text-ivory/50">
                  By joining, you agree to our Privacy Policy. Opt out anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory/60 gap-4">
          <p>© 2026 Trend Street Luxury Apparels Private Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping-policy" className="hover:text-gold transition-colors">
              Shipping Policy
            </Link>
            <Link href="/returns" className="hover:text-gold transition-colors">
              30-Day Returns
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Grievance Officer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
