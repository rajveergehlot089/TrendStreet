"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { StreetwearEditorialHero } from "@/components/StreetwearEditorialHero";
import { SilhouetteStudio } from "@/components/SilhouetteStudio";
import { NewArrivalsDropRadar } from "@/components/NewArrivalsDropRadar";
import { StreetwearLookbookMatrix } from "@/components/StreetwearLookbookMatrix";
import { LimitedEditionVault } from "@/components/LimitedEditionVault";
import { ShopTheFitSection } from "@/components/ShopTheFitSection";
import { CustomerReviewGallery } from "@/components/CustomerReviewGallery";
import { OffcultAssistDrawer } from "@/components/OffcultAssistDrawer";
import { LiveCourierTrackerModal } from "@/components/LiveCourierTrackerModal";

export default function HomePage() {
  const { products, siteSettings } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  const featuredProducts =
    activeCategory === "All"
      ? products.filter((p) => p.featured || p.isBestSeller).slice(0, 8)
      : products.filter((p) => p.category === activeCategory).slice(0, 8);

  // Exclusively 4 Core Wardrobe Pillars
  const categories = [
    {
      name: "Oversized" as const,
      href: "/oversized",
      count: "Heavyweight Silhouettes",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
      tagline: "520gsm Loopback & Combed Cotton",
    },
    {
      name: "Jeans" as const,
      href: "/jeans",
      count: "Selvedge & Bootcut Denim",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
      tagline: "14.5oz Okayama Shuttle Looms",
    },
    {
      name: "Boxy Fit" as const,
      href: "/boxy-fit",
      count: "Cropped & Dropped Knits",
      image: "https://images.unsplash.com/photo-1620012253295-c15c429fccf8?q=80&w=1200&auto=format&fit=crop",
      tagline: "Structured Minimalist Geometry",
    },
    {
      name: "Jackets" as const,
      href: "/jackets",
      count: "Flight Bombers & Moto Cuts",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
      tagline: "Tuscan Suede & Duck Canvas",
    },
  ];

  return (
    <div className="bg-[#FAF9F6] text-stone-900 space-y-12 sm:space-y-16 md:space-y-24 pb-16 sm:pb-24">
      {/* 1. EDITORIAL STREETWEAR HERO (Interactive 4-Silhouette Switcher & Model Fits) */}
      <StreetwearEditorialHero />

      {/* 2. MINIMALIST RUNWAY TICKER MARQUEE (Ultra-Clean, Light & Crisp) */}
      <div className="bg-white border-y border-stone-200 py-3 overflow-hidden select-none shadow-2xs">
        <div className="flex whitespace-nowrap animate-marquee space-x-10 sm:space-x-14 text-xs font-mono font-bold tracking-[0.2em] text-stone-800 uppercase">
          {siteSettings.marqueePhrases.concat(siteSettings.marqueePhrases).map((phrase, idx) => (
            <React.Fragment key={idx}>
              <span className="hover:text-burgundy transition-colors">{phrase}</span>
              <span className="text-burgundy/40">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. FOUR SILHOUETTES SHOWCASE (High-Fashion Model Category Cards) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 pb-3 border-b border-stone-200 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-burgundy block mb-0.5">
              Curated Wardrobe Pillars
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              The Four Silhouettes
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-burgundy hover:text-crimson flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Drops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative h-56 sm:h-72 lg:h-[420px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-3 sm:p-6 bg-stone-100"
            >
              {/* Background Model Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Refined Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Card Content */}
              <div className="relative z-10 space-y-0.5 sm:space-y-1">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-gold block line-clamp-1">
                  {cat.tagline}
                </span>
                <h3 className="font-serif text-base sm:text-2xl font-bold text-white group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/80 pt-1.5 sm:pt-2 border-t border-white/20">
                  <span className="line-clamp-1">{cat.count}</span>
                  <span className="flex items-center gap-0.5 text-gold font-semibold uppercase text-[9px] sm:text-[10px] tracking-wider group-hover:translate-x-1 transition-transform flex-shrink-0">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. NEW ARRIVALS DROP RADAR (Interactive Grid with 1-Tap Sizing) */}
      <NewArrivalsDropRadar />

      {/* 5. SHOP THE COMPLETE FIT - CURATED OUTFIT BUNDLER (Off Duty Signature) */}
      <div id="shop-the-fit">
        <ShopTheFitSection />
      </div>

      {/* 6. LIMITED EDITION VAULT CAPSULE (The Obsidian Numbered Drop) */}
      <LimitedEditionVault />

      {/* 7. SARTORIAL STREETWEAR LOOKBOOK: TOKYO TO BANDRA (Editorial Fits with Garment Hotspots) */}
      <StreetwearLookbookMatrix />

      {/* 8. SEASONAL HIGHLIGHTS WITH QUICK SIZE PILL SELECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 pb-3 border-b border-stone-200 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-burgundy block mb-0.5">
              Seasonal Releases
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              Trending In Tokyo & Milan
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-burgundy hover:text-crimson flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Explore All Drops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Silhouette Category Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-5 sm:mb-7 overflow-x-auto no-scrollbar pb-1">
          {["All", "Oversized", "Jeans", "Boxy Fit", "Jackets"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-burgundy text-white shadow-sm scale-102"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400 hover:text-stone-900"
              }`}
            >
              {cat === "All" ? "All Silhouettes" : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 9. INTERACTIVE SILHOUETTE STUDIO (DRAPE & STACKING LAB) */}
      <SilhouetteStudio />

      {/* 10. AUTHENTIC PHOTO-BACKED CUSTOMER REVIEW GALLERY */}
      <CustomerReviewGallery />

      {/* 11. FLOATING FIT CONCIERGE & LIVE COURIER TRACKER */}
      <OffcultAssistDrawer onOpenTracker={() => setIsTrackerOpen(true)} />

      <LiveCourierTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </div>
  );
}
