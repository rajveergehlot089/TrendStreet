"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/pricing";

interface MobileNewArrival {
  id: string;
  productId: string;
  name: string;
  category: "Oversized" | "Jeans" | "Boxy Fit" | "Jackets";
  price: number;
  originalPrice: number;
  tag: string;
  spec: string;
  heroImage: string;
  sizes: string[];
  stockBadge: string;
}

const MOBILE_NEW_ARRIVALS: MobileNewArrival[] = [
  {
    id: "mna-1",
    productId: "ts-001",
    name: "The Mayfair Heavyweight Tee",
    category: "Oversized",
    price: 2499,
    originalPrice: 2999,
    tag: "320 GSM Combed Cotton",
    spec: "Dropped shoulder volume with architectural structured collar",
    heroImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockBadge: "Drop 04 · Only 24 Left",
  },
  {
    id: "mna-2",
    productId: "ts-004",
    name: "The Shibuya Carpenter Selvedge",
    category: "Jeans",
    price: 5499,
    originalPrice: 6299,
    tag: "14oz Okayama Redline Denim",
    spec: "Wide skater puddle stacking woven on vintage Toyoda shuttle looms",
    heroImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
    sizes: ["30", "32", "34", "36"],
    stockBadge: "High Demand · Selling Fast",
  },
  {
    id: "mna-3",
    productId: "ts-002",
    name: "The Tokyo Drop-Shoulder Hoodie",
    category: "Oversized",
    price: 4999,
    originalPrice: 5799,
    tag: "520 GSM French Terry",
    spec: "Brutalist wide chest stance with double-walled standing hood",
    heroImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
    sizes: ["S", "M", "L", "XL"],
    stockBadge: "Limited Run · 15 Left",
  },
  {
    id: "mna-4",
    productId: "ts-010",
    name: "The Tuscan Suede Flight Bomber",
    category: "Jackets",
    price: 9999,
    originalPrice: 11499,
    tag: "Hand-Buffed Italian Suede",
    spec: "Cropped architectural hem with heavy antique brass RiRi hardware",
    heroImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
    sizes: ["S", "M", "L", "XL"],
    stockBadge: "VIP Capsule · Restocked",
  },
];

interface DesktopWearItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  tag: string;
  spec: string;
  pngSrc: string;
  alt: string;
  productId: string;
}

const FLYING_WEAR_ITEMS: DesktopWearItem[] = [
  {
    id: "wear-1",
    name: "The Tuscan Suede Flight Jacket",
    category: "Jackets Capsule",
    price: 9999,
    originalPrice: 11499,
    tag: "Italian Suede Cut",
    spec: "Dropped shoulder volume with architectural cropped drape",
    pngSrc: "/flying-wear-jacket.png",
    alt: "Flying Suede Flight Jacket",
    productId: "ts-010",
  },
  {
    id: "wear-2",
    name: "The Tokyo Drop-Shoulder Oversized Hoodie",
    category: "Oversized Silhouette",
    price: 4999,
    originalPrice: 5799,
    tag: "520gsm Loopback Terry",
    spec: "Unstructured wide drape with double-walled standing hood",
    pngSrc: "/flying-wear-coat.png",
    alt: "Flying Oversized Drop-Shoulder Hoodie",
    productId: "ts-002",
  },
  {
    id: "wear-3",
    name: "The Okayama Bootcut Flare Denim",
    category: "Bootcut & Selvedge",
    price: 5999,
    originalPrice: 6999,
    tag: "14.5oz Okayama Selvedge",
    spec: "Subtle ankle bootcut flare resting effortlessly over sneakers",
    pngSrc: "/flying-wear-jeans.png",
    alt: "Flying Okayama Bootcut Flare Jeans",
    productId: "ts-004",
  },
];

export const FlyingWearHero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileIdx, setMobileIdx] = useState(0);
  const [mobileSelectedSize, setMobileSelectedSize] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart, products } = useStore();

  const currentDesktopItem = FLYING_WEAR_ITEMS[activeIdx];
  const linkedDesktopProduct = products.find((p) => p.id === currentDesktopItem.productId) || products[0];

  const currentMobileArrival = MOBILE_NEW_ARRIVALS[mobileIdx];
  const linkedMobileProduct =
    products.find((p) => p.id === currentMobileArrival.productId) || products[0];

  // Scroll Parallax Hooks for the desktop flying animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const flyingY = useTransform(scrollYProgress, [0, 1], [-25, 45]);
  const rotateDeg = useTransform(scrollYProgress, [0, 1], [-3, 6]);
  const floatingShadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.9]);

  const shouldReduceMotion = useReducedMotion();

  const handleDesktopQuickAdd = () => {
    if (linkedDesktopProduct) {
      addToCart(
        linkedDesktopProduct,
        linkedDesktopProduct.sizes[0] || (linkedDesktopProduct.category === "Jeans" ? "32" : "M"),
        linkedDesktopProduct.colors[0]?.name || "Deep Burgundy",
        1
      );
    }
  };

  const handleMobileSizeSelect = (size: string) => {
    setMobileSelectedSize(size);
    if (linkedMobileProduct) {
      addToCart(
        linkedMobileProduct,
        size,
        linkedMobileProduct.colors[0]?.name || "Deep Burgundy",
        1
      );
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2200);
    }
  };

  const handleMobilePrev = () => {
    setMobileIdx((prev) => (prev === 0 ? MOBILE_NEW_ARRIVALS.length - 1 : prev - 1));
    setMobileSelectedSize(null);
  };

  const handleMobileNext = () => {
    setMobileIdx((prev) => (prev === MOBILE_NEW_ARRIVALS.length - 1 ? 0 : prev + 1));
    setMobileSelectedSize(null);
  };

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. MOBILE UI HERO: NEW ARRIVAL SHOWCASE (Rendered exclusively for < md)    */}
      {/* ========================================================================= */}
      <div className="flex md:hidden flex-col w-full bg-white rounded-2xl border border-burgundy/15 shadow-md overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="px-3.5 py-2.5 bg-espresso text-ivory flex items-center justify-between border-b border-burgundy/20">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">
              New Arrival Drop 04
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-ivory/70">
            0{mobileIdx + 1} / 0{MOBILE_NEW_ARRIVALS.length}
          </span>
        </div>

        {/* Hero Visual Stage with Touch Controls */}
        <div className="relative w-full aspect-[4/5] bg-ivory/50 overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMobileArrival.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <img
                src={currentMobileArrival.heroImage}
                alt={currentMobileArrival.name}
                className="w-full h-full object-cover object-center"
                loading="eager"
              />

              {/* Gradient Scrim for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-transparent to-espresso/30" />

              {/* Top Floating Spec Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-espresso/80 backdrop-blur-md text-[10px] font-bold tracking-wider text-gold border border-gold/20 shadow-sm">
                  {currentMobileArrival.tag}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-burgundy/90 backdrop-blur-md text-[9px] font-bold tracking-wider text-ivory uppercase shadow-sm">
                  {currentMobileArrival.stockBadge}
                </span>
              </div>

              {/* Bottom Overlaid Details */}
              <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gold block">
                  {currentMobileArrival.category} Silhouette
                </span>
                <h3 className="font-serif text-lg font-bold text-white leading-tight">
                  {currentMobileArrival.name}
                </h3>
                <div className="flex items-baseline space-x-2 pt-0.5">
                  <span className="text-base font-bold text-gold font-serif">
                    {formatPrice(currentMobileArrival.price)}
                  </span>
                  <span className="text-xs text-white/50 line-through">
                    {formatPrice(currentMobileArrival.originalPrice)}
                  </span>
                  <span className="text-[10px] text-green-400 font-bold uppercase">
                    Save {Math.round(((currentMobileArrival.originalPrice - currentMobileArrival.price) / currentMobileArrival.originalPrice) * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Touch Navigation Arrows */}
          <button
            type="button"
            onClick={handleMobilePrev}
            aria-label="Previous New Arrival"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-espresso/60 backdrop-blur-sm text-ivory flex items-center justify-center hover:bg-espresso active:scale-95 transition-all shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleMobileNext}
            aria-label="Next New Arrival"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-espresso/60 backdrop-blur-sm text-ivory flex items-center justify-center hover:bg-espresso active:scale-95 transition-all shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5">
            {MOBILE_NEW_ARRIVALS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  setMobileIdx(dotIdx);
                  setMobileSelectedSize(null);
                }}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  mobileIdx === dotIdx ? "w-5 bg-gold" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 1-Tap Quick Size Selector & Action Strip */}
        <div className="p-3.5 space-y-3 bg-white">
          {/* Quick Size Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold text-espresso uppercase tracking-wider text-[10px]">
                {addedSuccess
                  ? `✓ Size ${mobileSelectedSize} Added to Bag!`
                  : "1-Tap Size Select & Add:"}
              </span>
              <span className="text-[10px] text-espresso/50">Free Blue Dart Air</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {currentMobileArrival.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleMobileSizeSelect(sz)}
                  className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all active:scale-95 ${
                    mobileSelectedSize === sz && addedSuccess
                      ? "bg-green-700 text-white border-green-700 shadow-sm"
                      : "bg-ivory border-burgundy/15 text-espresso hover:bg-burgundy hover:text-gold"
                  }`}
                >
                  {mobileSelectedSize === sz && addedSuccess ? "✓" : sz}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 pt-1 border-t border-burgundy/10">
            <Link
              href={`/product/${currentMobileArrival.productId}`}
              className="flex-1 py-2.5 px-3 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-98 text-center"
            >
              <Eye className="w-3.5 h-3.5 text-gold" />
              <span>Inspect Fit Details</span>
            </Link>

            <Link
              href="/shop"
              className="py-2.5 px-3.5 bg-ivory text-espresso border border-burgundy/20 hover:border-burgundy text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1 text-center"
            >
              <span>All Drops</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Micro Trust Bar */}
          <div className="flex items-center justify-between text-[9px] text-espresso/60 pt-0.5">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-gold" />
              <span>Same-Day Mumbai Dispatch</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-burgundy" />
              <span>30-Day Doorstep Swap</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW (md: and above): Pure 3D Textured Floating Garment        */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        className="hidden md:flex relative w-full rounded-3xl overflow-hidden p-6 sm:p-10 flex-col justify-between min-h-[520px] sm:min-h-[580px] select-none"
      >
        {/* Soft Ambient Radial Luxury Halo (No box border) */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,rgba(107,29,36,0.05),transparent_70%)]" />
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-burgundy/5 blur-3xl pointer-events-none" />

        {/* Top Controls: Category & Tab Switcher (No borders around clothes) */}
        <div className="relative z-20 flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">
              {currentDesktopItem.category} • 3D Textile Weave
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center space-x-2 bg-ivory/80 backdrop-blur-md p-1 rounded-full shadow-xs">
            {FLYING_WEAR_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                  activeIdx === idx
                    ? "bg-burgundy text-gold shadow-sm scale-105"
                    : "text-espresso/70 hover:text-burgundy"
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Main Floating 3D Cloth Stage — STRICTLY NO BORDER AROUND CLOTHES */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDesktopItem.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 30, rotate: -4 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: [0, -14, 0],
                      rotate: [0, 2, -1, 0],
                      transition: {
                        y: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
                        rotate: { repeat: Infinity, duration: 6.2, ease: "easeInOut" },
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.4 },
                      },
                    }
              }
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: -30, rotate: 4, transition: { duration: 0.3 } }}
              style={shouldReduceMotion ? {} : { y: flyingY, rotate: rotateDeg }}
              className="relative w-80 h-80 lg:w-96 lg:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing"
              whileHover={{ scale: 1.06 }}
            >
              {/* Only the 3D Textured Cloth itself — pure transparent render, zero border */}
              <img
                src={currentDesktopItem.pngSrc}
                alt={currentDesktopItem.alt}
                className="w-full h-full object-contain filter drop-shadow-[0_28px_40px_rgba(43,8,10,0.24)] pointer-events-none"
                loading="eager"
              />

              {/* Dynamic Floating Shadow on Ground */}
              <motion.div
                style={{ scale: floatingShadowScale }}
                className="absolute -bottom-8 w-56 h-6 rounded-full bg-espresso/20 blur-md pointer-events-none"
              />

              {/* Floating Editorial Badge — borderless blur pill */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -right-4 top-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span className="text-[11px] font-bold text-espresso tracking-wide">
                  {currentDesktopItem.tag}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Floating Details & Action Bar */}
        <div className="relative z-20 pt-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg lg:text-xl font-bold text-espresso">
                {currentDesktopItem.name}
              </h3>
              <span className="text-sm font-serif font-bold text-burgundy">
                {formatPrice(currentDesktopItem.price)}
              </span>
              <span className="text-xs text-espresso/40 line-through">
                {formatPrice(currentDesktopItem.originalPrice)}
              </span>
            </div>
            <p className="text-xs text-espresso/70 font-light max-w-md">
              {currentDesktopItem.spec}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDesktopQuickAdd}
              className="py-2.5 px-5 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-md group"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
              <span>Claim Piece</span>
            </button>

            <Link
              href={`/product/${currentDesktopItem.productId}`}
              className="py-2.5 px-4 bg-ivory/80 hover:bg-ivory text-espresso hover:text-burgundy text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
