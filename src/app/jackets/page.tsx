"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, Flame } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export default function JacketsLandingPage() {
  const { products } = useStore();
  const jacketsProducts = products.filter((p) => p.category === "Jackets");

  const [selectedSort, setSelectedSort] = useState("featured");

  const sortedProducts = [...jacketsProducts].sort((a, b) => {
    if (selectedSort === "price-asc") return a.price - b.price;
    if (selectedSort === "price-desc") return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2B080A] via-espresso to-[#150A0B] text-ivory p-8 sm:p-14 lg:p-20 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-bold uppercase tracking-[0.25em]">
              <Flame className="w-3.5 h-3.5 text-crimson" />
              <span>Florentine Suede & Duck Canvas</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08]">
              The Structural <br />
              <span className="text-gold italic font-normal">Jackets Vault.</span>
            </h1>

            <p className="text-sm sm:text-base text-ivory/85 leading-relaxed font-light">
              Crafted in Florence and London. From butter-soft Tuscan lambskin suede flight bombers with Swiss Raccagni two-way zippers to 16oz rugged duck canvas workwear armor.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> Tuscan Lambskin Suede
              </span>
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> 16oz Rugged Duck Canvas
              </span>
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <Check className="w-4 h-4 text-gold" /> Swiss Dual-Pull Zippers
              </span>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop"
            alt="Handcrafted Jackets"
            className="absolute inset-0 w-full h-full object-cover object-right opacity-30 mix-blend-overlay pointer-events-none"
          />
        </div>
      </section>

      {/* 2. CRAFTSMANSHIP PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-espresso">
          <div className="p-6 rounded-2xl bg-white border border-burgundy/15 space-y-3">
            <span className="font-serif text-2xl font-bold text-burgundy">100% Suede</span>
            <h3 className="font-serif text-lg font-bold">Florentine Lambskin</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              Artisanal reverse suede hand-selected in Florence. Treated for subtle water resistance while maintaining its velvety soft nap.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/15 space-y-3">
            <span className="font-serif text-2xl font-bold text-burgundy">16oz Duck</span>
            <h3 className="font-serif text-lg font-bold">Washed Heavy Canvas</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              Triple-needle chain-stitched at all stress points with heavy brass front hardware and warm quilted flannel lining.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/15 space-y-3">
            <span className="font-serif text-2xl font-bold text-burgundy">Raccagni Zips</span>
            <h3 className="font-serif text-lg font-bold">2-Way Swiss Hardware</h3>
            <p className="text-xs text-espresso/70 leading-relaxed font-light">
              Dual-pull antiqued brass zippers allow you to open the hem when sitting or driving to preserve natural jacket drape.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-burgundy/15">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              The Jacket Drops
            </h2>
            <p className="text-xs text-espresso/60">
              Showing {sortedProducts.length} outerwear & leather jackets
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
