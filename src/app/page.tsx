"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Quote,
  Flame,
  Truck,
  Layers,
  Ruler,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { FlyingWearHero } from "@/components/FlyingWearHero";
import { SilhouetteStudio } from "@/components/SilhouetteStudio";
import { GeoFaqSection } from "@/components/GeoFaqSection";
import { NewArrivalsDropRadar } from "@/components/NewArrivalsDropRadar";
import { StreetwearLookbookMatrix } from "@/components/StreetwearLookbookMatrix";
import { StreetwearPerksMatrix } from "@/components/StreetwearPerksMatrix";
import { LimitedEditionVault } from "@/components/LimitedEditionVault";
import { ShopTheFitSection } from "@/components/ShopTheFitSection";
import { CommunityStreetwearWall } from "@/components/CommunityStreetwearWall";
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

  // Exclusively 4 Core Pillars with Dynamic Taglines from Admin SiteSettings
  const categories = [
    {
      name: "Oversized" as const,
      href: "/oversized",
      count: "Heavyweight Silhouettes",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
      tagline: siteSettings.categoryTaglines.Oversized || "520gsm Loopback & Combed Cotton",
    },
    {
      name: "Jeans" as const,
      href: "/jeans",
      count: "Selvedge & Bootcut Denim",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
      tagline: siteSettings.categoryTaglines.Jeans || "14.5oz Okayama Shuttle Looms",
    },
    {
      name: "Boxy Fit" as const,
      href: "/boxy-fit",
      count: "Cropped & Dropped Knits",
      image: "https://images.unsplash.com/photo-1620012253295-c15c429fccf8?q=80&w=1200&auto=format&fit=crop",
      tagline: siteSettings.categoryTaglines["Boxy Fit"] || "Structured Minimalist Geometry",
    },
    {
      name: "Jackets" as const,
      href: "/jackets",
      count: "Flight Bombers & Moto Cuts",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
      tagline: siteSettings.categoryTaglines.Jackets || "Tuscan Suede & Duck Canvas",
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-16 md:space-y-24 pb-12 sm:pb-20">
      {/* 1. HERO SECTION WITH DYNAMIC HEADLINES & RESPONSIVE SHOWCASE (Mobile New Arrivals + Desktop 3D) */}
      <section className="relative px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 md:pt-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-crimson" />
              <span>{siteSettings.hero.badgeText}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-espresso leading-[1.1]">
              {siteSettings.hero.titleLine1} <br />
              <span className="text-burgundy italic font-normal">
                {siteSettings.hero.titleLine2}
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-espresso/80 leading-relaxed max-w-lg font-light">
              {siteSettings.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-row items-center gap-2.5 pt-1 sm:pt-2">
              <Link
                href={siteSettings.hero.primaryBtnLink || "/shop"}
                className="flex-1 sm:flex-initial py-3 px-5 sm:py-4 sm:px-8 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded-md transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 group text-center"
              >
                <span>{siteSettings.hero.primaryBtnText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={siteSettings.hero.secondaryBtnLink || "/lookbook"}
                className="flex-1 sm:flex-initial py-3 px-4 sm:py-4 sm:px-8 border border-burgundy/30 hover:border-burgundy text-burgundy hover:bg-burgundy/5 text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded-md transition-colors text-center"
              >
                {siteSettings.hero.secondaryBtnText}
              </Link>
            </div>

            {/* Mobile Quick Silhouette Capsules */}
            <div className="flex sm:hidden items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar pb-1">
              {[
                { label: "New Arrivals", href: "#new-arrivals" },
                { label: "Oversized", href: "/oversized" },
                { label: "Jeans", href: "/jeans" },
                { label: "Boxy Fit", href: "/boxy-fit" },
                { label: "Jackets", href: "/jackets" },
                { label: "Shop The Fit", href: "#shop-the-fit" },
              ].map((pill) => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="px-3 py-1 bg-ivory border border-burgundy/20 hover:border-burgundy rounded-full text-[10px] font-bold uppercase tracking-wider text-espresso whitespace-nowrap active:scale-95 transition-transform shadow-2xs"
                >
                  {pill.label}
                </Link>
              ))}
            </div>

            {/* Micro Accreditations / Live Metrics */}
            <div className="pt-3 sm:pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-burgundy/15 text-xs text-espresso/70">
              <div>
                <span className="block font-serif text-base sm:text-xl font-bold text-burgundy">
                  {siteSettings.hero.stat1Value}
                </span>
                <span className="text-[10px] sm:text-[11px] leading-tight block text-espresso/60">
                  {siteSettings.hero.stat1Label}
                </span>
              </div>
              <div>
                <span className="block font-serif text-base sm:text-xl font-bold text-burgundy">
                  {siteSettings.hero.stat2Value}
                </span>
                <span className="text-[10px] sm:text-[11px] leading-tight block text-espresso/60">
                  {siteSettings.hero.stat2Label}
                </span>
              </div>
              <div>
                <span className="block font-serif text-base sm:text-xl font-bold text-burgundy">
                  {siteSettings.hero.stat3Value}
                </span>
                <span className="text-[10px] sm:text-[11px] leading-tight block text-espresso/60">
                  {siteSettings.hero.stat3Label}
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero: Responsive Showcase (Mobile Touch Card Deck + Desktop 3D Cloth Physics) */}
          <div className="lg:col-span-6 w-full">
            <FlyingWearHero />
          </div>
        </div>
      </section>

      {/* 2. RUNWAY TICKER MARQUEE */}
      <div className="bg-espresso text-gold py-2 sm:py-3 overflow-hidden border-y border-burgundy/30 select-none">
        <div className="flex whitespace-nowrap animate-marquee space-x-8 sm:space-x-12 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em]">
          {siteSettings.marqueePhrases.concat(siteSettings.marqueePhrases).map((phrase, idx) => (
            <React.Fragment key={idx}>
              <span>{phrase}</span>
              <span className="text-ivory/40">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. STREETWEAR VIP PERKS & ASSURANCE MATRIX (Blue Dart Air, 30-Day Doorstep Swap, 320gsm Guarantee) */}
      <StreetwearPerksMatrix />

      {/* 4. FOUR SILHOUETTES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 pb-3 border-b border-burgundy/15 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-crimson block mb-0.5">
              Curated Wardrobe Pillars
            </span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-espresso">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative h-48 sm:h-64 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-3 sm:p-6"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/45 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Card Content */}
              <div className="relative z-10 space-y-0.5 sm:space-y-1">
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gold block line-clamp-1">
                  {cat.tagline}
                </span>
                <h3 className="font-serif text-sm sm:text-2xl font-bold text-ivory group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-ivory/70 pt-1.5 sm:pt-2 border-t border-ivory/15">
                  <span className="line-clamp-1">{cat.count}</span>
                  <span className="flex items-center gap-0.5 text-gold font-semibold uppercase text-[9px] sm:text-[10px] tracking-wider group-hover:translate-x-1 transition-transform flex-shrink-0">
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. NEW ARRIVALS DROP RADAR & LIVE RESTOCK TICKER */}
      <NewArrivalsDropRadar />

      {/* 6. SHOP THE COMPLETE FIT - CURATED OUTFIT BUNDLER (Off Duty Signature) */}
      <div id="shop-the-fit">
        <ShopTheFitSection />
      </div>

      {/* 7. LIMITED EDITION VAULT CAPSULE (The Midnight Capsule - 120 Units Worldwide) */}
      <LimitedEditionVault />

      {/* 8. SARTORIAL STREETWEAR LOOKBOOK: TOKYO TO BANDRA */}
      <StreetwearLookbookMatrix />

      {/* 9. SEASONAL HIGHLIGHTS WITH QUICK SIZE PILL SELECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 pb-3 border-b border-burgundy/15 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-crimson block mb-0.5">
              Seasonal Releases
            </span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-espresso">
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
        <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto no-scrollbar pb-1">
          {["All", "Oversized", "Jeans", "Boxy Fit", "Jackets"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-burgundy text-gold shadow-sm scale-105"
                  : "bg-ivory text-espresso/70 border border-burgundy/15 hover:border-burgundy hover:text-espresso"
              }`}
            >
              {cat === "All" ? "All Silhouettes" : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 10. INTERACTIVE SILHOUETTE STUDIO (DRAPE & STACKING LAB) */}
      <SilhouetteStudio />

      {/* 11. WORN ON THE STREETS - REAL BODY FIT CHECKS (Social Proof across Indian Cities) */}
      <CommunityStreetwearWall />

      {/* 12. EDITORIAL DOSSIER TEASER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-burgundy text-ivory p-6 sm:p-12 lg:p-20 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Editorial Dossier
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Autumn / Winter 2026: <br />
              The Street & Structure Dialogue
            </h2>
            <p className="text-xs sm:text-sm text-ivory/85 leading-relaxed font-light">
              Explore our curated silhouette styling guide with interactive hotspots. From 520gsm loopback oversized hoodies paired with Shibuya carpenter denim to cropped Tuscan suede bombers.
            </p>
            <div className="pt-2">
              <Link
                href="/lookbook"
                className="inline-flex items-center gap-2 py-3 px-6 sm:py-3.5 sm:px-8 bg-gold hover:bg-gold-light text-espresso font-bold text-xs uppercase tracking-[0.2em] rounded-md transition-all shadow-md"
              >
                <span>Enter The Lookbook</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Background Ambient Styling Image */}
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
            alt="Editorial Model"
            className="absolute inset-0 w-full h-full object-cover object-right opacity-30 mix-blend-overlay pointer-events-none"
            loading="lazy"
          />
        </div>
      </section>

      {/* 13. PRESS & VIP CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-crimson block mb-0.5">
            Critical Acclaim
          </span>
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-espresso">
            What The Fashion Press Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-8">
          <div className="p-5 sm:p-8 bg-white rounded-xl sm:rounded-2xl border border-burgundy/15 shadow-xs space-y-3">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
            <p className="text-xs sm:text-sm text-espresso/80 italic leading-relaxed">
              &ldquo;Trend Street accomplishes what few contemporary labels can: marrying heavyweight brutalist drape with pristine Japanese denim mill craftsmanship.&rdquo;
            </p>
            <div className="pt-2 border-t border-ivory-dark">
              <h5 className="font-bold text-xs uppercase tracking-wider text-burgundy">Hypebeast Editorial</h5>
              <span className="text-[10px] sm:text-[11px] text-espresso/50">November 2026 Issue</span>
            </div>
          </div>

          <div className="p-5 sm:p-8 bg-white rounded-xl sm:rounded-2xl border border-burgundy/15 shadow-xs space-y-3">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
            <p className="text-xs sm:text-sm text-espresso/80 italic leading-relaxed">
              &ldquo;The Shibuya Carpenter Denim is the definitive silhouette of the season. Generous stacking without dragging, crafted from vintage redline selvedge.&rdquo;
            </p>
            <div className="pt-2 border-t border-ivory-dark">
              <h5 className="font-bold text-xs uppercase tracking-wider text-burgundy">Highsnobiety Selects</h5>
              <span className="text-[10px] sm:text-[11px] text-espresso/50">Denim Awards</span>
            </div>
          </div>

          <div className="p-5 sm:p-8 bg-white rounded-xl sm:rounded-2xl border border-burgundy/15 shadow-xs space-y-3">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
            <p className="text-xs sm:text-sm text-espresso/80 italic leading-relaxed">
              &ldquo;The 520gsm oversized hoodie has the most structural hood we have tested in years. It hangs impeccably away from the torso.&rdquo;
            </p>
            <div className="pt-2 border-t border-ivory-dark">
              <h5 className="font-bold text-xs uppercase tracking-wider text-burgundy">GQ Style Guide</h5>
              <span className="text-[10px] sm:text-[11px] text-espresso/50">Winter Essentials</span>
            </div>
          </div>
        </div>
      </section>

      {/* 14. GEO & SARTORIAL CITABILITY FAQ */}
      <GeoFaqSection />

      {/* 15. FLOATING FIT CONCIERGE & MODALS */}
      <OffcultAssistDrawer onOpenTracker={() => setIsTrackerOpen(true)} />

      <LiveCourierTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </div>
  );
}
