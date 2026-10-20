"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, SlidersHorizontal, ShieldCheck, Flame } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export default function OversizedLandingPage() {
  const { products, siteSettings } = useStore();
  const oversizedProducts = products.filter((p) => p.category === "Oversized");

  const [selectedSort, setSelectedSort] = useState("featured");

  const sortedProducts = [...oversizedProducts].sort((a, b) => {
    if (selectedSort === "price-asc") return a.price - b.price;
    if (selectedSort === "price-desc") return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-8 sm:space-y-14 md:space-y-20 pb-16">
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative px-3 sm:px-6 lg:px-8 pt-4 sm:pt-10 max-w-7xl mx-auto">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-espresso via-burgundy to-espresso text-ivory p-5 sm:p-10 lg:p-16 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
              <Flame className="w-3 h-3 text-crimson" />
              <span>Autumn / Winter 2026 Drops</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              The Oversized <br />
              <span className="text-gold italic font-normal">Architecture.</span>
            </h1>

            <p className="text-xs sm:text-base text-ivory/85 leading-relaxed font-light">
              {siteSettings?.categoryTaglines?.Oversized ||
                "Milled from custom 320gsm–520gsm Japanese loopback cotton and combed jersey. Exaggerated shoulder drop lines, zero side-tension, and an unyielding column drape that stands apart from the torso."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> 520gsm Loopback French Terry
              </span>
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> Pre-Shrunk & Garment Dyed
              </span>
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> Seamless Dropped Shoulders
              </span>
            </div>
          </div>

          {/* Background Ambient High-Fashion Image */}
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop"
            alt="Oversized Streetwear Silhouette"
            className="absolute inset-0 w-full h-full object-cover object-right opacity-30 mix-blend-overlay pointer-events-none"
          />
        </div>
      </section>

      {/* 2. SILHOUETTE BLUEPRINT BREAKDOWN */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 text-espresso">
          <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-burgundy/15 space-y-2 sm:space-y-3 shadow-xs">
            <span className="font-serif text-xl sm:text-2xl font-bold text-burgundy">320–520 GSM</span>
            <h3 className="font-serif text-base sm:text-lg font-bold">Unmatched Fabric Density</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              Lightweight tees cling; heavyweight jerseys drape. Our fabrics retain a sculpted rectangular profile regardless of body movement.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-burgundy/15 space-y-2 sm:space-y-3 shadow-xs">
            <span className="font-serif text-xl sm:text-2xl font-bold text-burgundy">+12 cm</span>
            <h3 className="font-serif text-base sm:text-lg font-bold">Calculated Drop Stance</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              We extend the shoulder seam by exactly 12cm while tapering the wrist rib to guarantee zero sloppy bunching over wrists or watch faces.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-burgundy/15 space-y-2 sm:space-y-3 shadow-xs">
            <span className="font-serif text-xl sm:text-2xl font-bold text-burgundy">Double-Walled</span>
            <h3 className="font-serif text-base sm:text-lg font-bold">Self-Supporting Hoods</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              Engineered without drawstrings. The two-ply hood stands completely upright on its own, framing the jawline with brutalist symmetry.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-burgundy/15">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-espresso">
              Current Oversized Drops
            </h2>
            <p className="text-[11px] sm:text-xs text-espresso/60">
              Showing {sortedProducts.length} limited atelier releases
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-espresso/60 font-semibold uppercase tracking-wider text-[11px]">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-white border border-burgundy/20 rounded-lg px-2.5 py-1.5 text-xs text-espresso font-semibold focus:outline-none focus:border-burgundy"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
          {sortedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
}
