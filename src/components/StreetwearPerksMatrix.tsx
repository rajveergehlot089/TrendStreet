"use client";

import React from "react";
import {
  Truck,
  RotateCcw,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const StreetwearPerksMatrix: React.FC = () => {
  const perks = [
    {
      icon: Truck,
      badge: "Blue Dart Apex Air",
      title: "24-Hour Atelier Dispatch",
      description:
        "Every garment is checked and dispatched within 24 hours from Bandra West, Mumbai. Delivered in 2–3 days to Metro hubs with real-time SMS tracking.",
      stat: "2–3 Days",
      statLabel: "Average Metro Transit",
    },
    {
      icon: RotateCcw,
      badge: "Doorstep Service",
      title: "30-Day Instant Size Swap",
      description:
        "Streetwear proportions matter. If the stack or shoulder drop isn't exact, our courier rider delivers your replacement size right to your door with zero hassle.",
      stat: "30 Days",
      statLabel: "Complimentary Exchanges",
    },
    {
      icon: Scale,
      badge: "Heavyweight Standard",
      title: "320–520 GSM Pure Weight",
      description:
        "We never produce thin fast-fashion apparel. Milled exclusively from 320gsm combed cotton, 520gsm loopback French terry, and 14.5oz Okayama selvedge.",
      stat: "320+ GSM",
      statLabel: "Guaranteed Density",
    },
    {
      icon: ShieldCheck,
      badge: "Verified Gateway",
      title: "Instant UPI & Cash on Delivery",
      description:
        "Seamless checkout with Google Pay, PhonePe, Paytm, RuPay, Visa, and COD. Cryptographically signed transactions via Razorpay with instant order confirmation.",
      stat: "100% Safe",
      statLabel: "Encrypted & Verified",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="bg-ivory/80 rounded-2xl sm:rounded-3xl border border-burgundy/15 p-5 sm:p-10 shadow-xs">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>The Trend Street Standard</span>
          </div>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-espresso">
            Built for Streetwear Connoisseurs
          </h2>
          <p className="text-xs sm:text-sm text-espresso/70 mt-1 font-light">
            Luxury menswear engineering backed by uncompromising customer service across India.
          </p>
        </div>

        {/* 4-Card Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl p-5 border border-burgundy/10 shadow-xs hover:shadow-md hover:border-burgundy/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center">
                      <Icon className="w-5 h-5 text-crimson" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-espresso/60 px-2 py-0.5 rounded bg-ivory border border-burgundy/10">
                      {perk.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-espresso">
                    {perk.title}
                  </h3>

                  <p className="text-xs text-espresso/75 leading-relaxed font-light">
                    {perk.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-burgundy/10 flex items-baseline justify-between">
                  <span className="font-serif text-base font-bold text-burgundy">
                    {perk.stat}
                  </span>
                  <span className="text-[10px] text-espresso/50 uppercase font-semibold">
                    {perk.statLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
