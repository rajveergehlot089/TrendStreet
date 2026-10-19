"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  Quote,
  Flame,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { FlyingWearHero } from "@/components/FlyingWearHero";
import { SilhouetteStudio } from "@/components/SilhouetteStudio";
import { GeoFaqSection } from "@/components/GeoFaqSection";

export default function HomePage() {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const featuredProducts = products.filter((p) => p.featured || p.isBestSeller).slice(0, 8);

  // Exclusively 4 Core Pillars
  const categories = [
    {
      name: "Oversized",
      href: "/shop?category=Oversized",
      count: "Heavyweight Silhouettes",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
      tagline: "520gsm Loopback & Combed Cotton",
    },
    {
      name: "Jeans",
      href: "/shop?category=Jeans",
      count: "Selvedge & Carpenter Denim",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
      tagline: "14oz Okayama Shuttle Looms",
    },
    {
      name: "Boxy Fit",
      href: "/shop?category=Boxy+Fit",
      count: "Cropped & Dropped Knits",
      image: "https://images.unsplash.com/photo-1620012253295-c15c429fccf8?q=80&w=1200&auto=format&fit=crop",
      tagline: "Structured Minimalist Geometry",
    },
    {
      name: "Jackets",
      href: "/shop?category=Jackets",
      count: "Flight Bombers & Moto Cuts",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
      tagline: "Tuscan Suede & Duck Canvas",
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. HERO SECTION WITH FLYING WEAR SHOWCASE */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-burgundy/10 border border-burgundy/20 text-burgundy text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-crimson" />
              <span>Autumn / Winter 2026 Drops</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-espresso leading-[1.1]">
              Oversized Silhouettes. <br />
              <span className="text-burgundy italic font-normal">Modern Distinction.</span>
            </h1>

            <p className="text-sm sm:text-base text-espresso/80 leading-relaxed max-w-lg font-light">
              Trend Street redefines contemporary menswear through heavyweight drape, architectural boxy fits, Okayama selvedge denim jeans, and handcrafted flight jackets.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="py-4 px-8 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-[0.2em] rounded-md transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group"
              >
                <span>Explore The Drops</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/lookbook"
                className="py-4 px-8 border border-burgundy/30 hover:border-burgundy text-burgundy hover:bg-burgundy/5 text-xs font-bold uppercase tracking-[0.2em] rounded-md transition-colors text-center"
              >
                View Lookbook
              </Link>
            </div>

            {/* Micro Accreditations */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-burgundy/15 text-xs text-espresso/70">
              <div>
                <span className="block font-serif text-xl font-bold text-burgundy">520gsm</span>
                <span className="text-[11px] leading-tight">Heavyweight Loopback</span>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-burgundy">14oz</span>
                <span className="text-[11px] leading-tight">Okayama Selvedge Denim</span>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-burgundy">Boxy Cut</span>
                <span className="text-[11px] leading-tight">Dropped-Shoulder Geometry</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Flying Luxury Wear Showcase */}
          <div className="lg:col-span-6 w-full">
            <FlyingWearHero />
          </div>
        </div>
      </section>

      {/* 2. RUNWAY TICKER MARQUEE */}
      <div className="bg-espresso text-gold py-3 overflow-hidden border-y border-burgundy/30 select-none">
        <div className="flex whitespace-nowrap animate-marquee space-x-12 text-xs font-semibold uppercase tracking-[0.25em]">
          <span>HEAVYWEIGHT OVERSIZED HOODIES</span>
          <span className="text-ivory/40">✦</span>
          <span>14OZ OKAYAMA REDLINE SELVEDGE JEANS</span>
          <span className="text-ivory/40">✦</span>
          <span>BOXY FIT CROPPED GEOMETRY</span>
          <span className="text-ivory/40">✦</span>
          <span>TUSCAN SUEDE & FLIGHT JACKETS</span>
          <span className="text-ivory/40">✦</span>
          <span>COMPLIMENTARY WORLDWIDE VIP COURIER</span>
          <span className="text-ivory/40">✦</span>
          <span>520GSM JAPANESE FRENCH LOOPBACK TERRY</span>
          <span className="text-ivory/40">✦</span>
        </div>
      </div>

      {/* 3. CURATED SILHOUETTES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-burgundy/15 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-crimson block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
              The Four Silhouettes
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-widest text-burgundy hover:text-crimson flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 border border-burgundy/10"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

              {/* Card Content */}
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
                  {cat.tagline}
                </span>
                <h3 className="font-serif text-2xl font-bold text-ivory group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-ivory/70 pt-2 border-t border-ivory/15">
                  <span>{cat.count}</span>
                  <span className="flex items-center gap-1 text-gold font-semibold uppercase text-[10px] tracking-wider group-hover:translate-x-1 transition-transform">
                    Discover <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. TRENDING NOW SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-burgundy/15 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-crimson block mb-1">
              Seasonal Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
              Trending In Tokyo & Milan
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-widest text-burgundy hover:text-crimson flex items-center gap-1.5 transition-colors"
          >
            <span>Explore All Drops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE SILHOUETTE STUDIO (MID-SITE LAB) */}
      <SilhouetteStudio />

      {/* 6. EDITORIAL LOOKBOOK TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-burgundy text-ivory p-8 sm:p-14 lg:p-20 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-5">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Editorial Dossier
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Autumn / Winter 2026: <br />
              The Street & Structure Dialogue
            </h2>
            <p className="text-sm text-ivory/85 leading-relaxed font-light">
              Explore our curated silhouette styling guide with interactive hotspots. From 520gsm loopback oversized hoodies paired with Shibuya carpenter denim to cropped Tuscan suede bombers.
            </p>
            <div className="pt-2">
              <Link
                href="/lookbook"
                className="inline-flex items-center gap-2 py-3.5 px-8 bg-gold hover:bg-gold-light text-espresso font-bold text-xs uppercase tracking-[0.2em] rounded-md transition-all shadow-lg"
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
            className="absolute inset-0 w-full h-full object-cover object-right opacity-30 mix-blend-overlay"
          />
        </div>
      </section>

      {/* 7. PRESS & VIP CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-crimson block mb-1">
            Critical Acclaim
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
            What The Fashion Press Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl border border-burgundy/15 shadow-sm space-y-4">
            <Quote className="w-8 h-8 text-gold" />
            <p className="text-xs text-espresso/80 italic leading-relaxed">
              "Trend Street accomplishes what few contemporary labels can: marrying heavyweight brutalist drape with pristine Japanese denim mill craftsmanship."
            </p>
            <div className="pt-2 border-t border-ivory-dark">
              <h5 className="font-bold text-xs uppercase tracking-wider text-burgundy">Hypebeast Editorial</h5>
              <span className="text-[11px] text-espresso/50">November 2026 Issue</span>
            </div>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-burgundy/15 shadow-sm space-y-4">
            <Quote className="w-8 h-8 text-gold" />
            <p className="text-xs text-espresso/80 italic leading-relaxed">
              "The Shibuya Carpenter Denim is the definitive silhouette of the season. Generous stacking without dragging, tailored with vintage redline selvedge."
            </p>
            <div className="pt-2 border-t border-ivory-dark">
              <h5 className="font-bold text-xs uppercase tracking-wider text-burgundy">Highsnobiety Selects</h5>
              <span className="text-[11px] text-espresso/50">Denim Awards</span>
            </div>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-burgundy/15 shadow-sm space-y-4">
            <Quote className="w-8 h-8 text-gold" />
            <p className="text-xs text-espresso/80 italic leading-relaxed">
              "The 520gsm oversized hoodie has the most structural hood we have tested in years. It hangs impeccably away from the torso."
            </p>
            <div className="pt-2 border-t border-ivory-dark">
              <h5 className="font-bold text-xs uppercase tracking-wider text-burgundy">GQ Style Guide</h5>
              <span className="text-[11px] text-espresso/50">Winter Essentials</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GEO & SARTORIAL CITABILITY FAQ */}
      <GeoFaqSection />
    </div>
  );
}
