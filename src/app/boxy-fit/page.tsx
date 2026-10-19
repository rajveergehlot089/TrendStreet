"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, Flame } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export default function BoxyFitLandingPage() {
  const { products } = useStore();
  const boxyProducts = products.filter((p) => p.category === "Boxy Fit");

  const [selectedSort, setSelectedSort] = useState("featured");

  const sortedProducts = [...boxyProducts].sort((a, b) => {
    if (selectedSort === "price-asc") return a.price - b.price;
    if (selectedSort === "price-desc") return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-espresso via-[#3A141A] to-burgundy text-ivory p-8 sm:p-14 lg:p-20 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-bold uppercase tracking-[0.25em]">
              <Flame className="w-3.5 h-3.5 text-crimson" />
              <span>Geometric Modernity</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08]">
              The Boxy Fit <br />
              <span className="text-gold italic font-normal">Geometry.</span>
            </h1>

            <p className="text-sm sm:text-base text-ivory/85 leading-relaxed font-light">
              Wide horizontal shoulder stance paired with an intentional crop at the natural waistline. Engineered from 220gsm mercerized poplin and 7-gauge Italian extra-fine merino wool to visually maximize leg proportions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> Squared-Off Flat Hems
              </span>
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> Italian Extra-Fine Merino
              </span>
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> Swiss Excella Hardware
              </span>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1620012253295-c15c429fccf8?q=80&w=1200&auto=format&fit=crop"
            alt="Boxy Fit Streetwear"
            className="absolute inset-0 w-full h-full object-cover object-right opacity-30 mix-blend-overlay pointer-events-none"
          />
        </div>
      </section>

      {/* 2. GEOMETRY SPECS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-espresso">
          <div className="p-6 rounded-2xl bg-white border border-burgundy/15 space-y-3">
            <span className="font-serif text-2xl font-bold text-burgundy">1:1 Ratio</span>
            <h3 className="font-serif text-lg font-bold">Square Torso Balance</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              By equalizing chest width and torso length, the boxy cut establishes an architectural square proportion that rebalances contemporary outfits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/15 space-y-3">
            <span className="font-serif text-2xl font-bold text-burgundy">Cropped Waist</span>
            <h3 className="font-serif text-lg font-bold">High-Rise Pairing</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              Cropped right at the belt line to prevent fabric bunching over jeans and showcase selvedge waistband leather patches cleanly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/15 space-y-3">
            <span className="font-serif text-2xl font-bold text-burgundy">220 GSM</span>
            <h3 className="font-serif text-lg font-bold">Mercerized Poplin</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              Woven tightly with high twist count to ensure the square boxy drape stands stiff and crisp even in high humidity.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-burgundy/15">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              The Boxy Drops
            </h2>
            <p className="text-xs text-espresso/60">
              Showing {sortedProducts.length} cropped overshirts, knits & half-zips
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-espresso/60 font-semibold uppercase tracking-wider">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-white border border-burgundy/20 rounded-lg px-3 py-1.5 text-xs text-espresso font-semibold focus:outline-none focus:border-burgundy"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
}
