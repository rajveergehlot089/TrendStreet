"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShoppingBag, Eye, Layers } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface WearItem {
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

const FLYING_WEAR_ITEMS: WearItem[] = [
  {
    id: "wear-1",
    name: "The Mayfair Velvet Flight Jacket",
    category: "Jackets Capsule",
    price: 1250,
    originalPrice: 1390,
    tag: "Italian Velvet Cut",
    spec: "Dropped shoulder volume with natural weightless floating drape",
    pngSrc: "/flying-wear-jacket.png",
    alt: "Flying Velvet Flight Jacket",
    productId: "ts-010",
  },
  {
    id: "wear-2",
    name: "The Tuscan Double-Faced Coat",
    category: "Oversized Silhouette",
    price: 1450,
    originalPrice: 1650,
    tag: "Pure Noble Fibers",
    spec: "Unstructured wide drape with relaxed Italian boxy geometry",
    pngSrc: "/flying-wear-coat.png",
    alt: "Flying Oversized Double-Faced Coat",
    productId: "ts-002",
  },
  {
    id: "wear-3",
    name: "The Shibuya Relaxed Carpenter Jeans",
    category: "Selvedge Jeans",
    price: 320,
    originalPrice: 360,
    tag: "14oz Okayama Denim",
    spec: "Baggy thigh with vintage wash and subtle sneaker stack",
    pngSrc: "/flying-wear-jeans.png",
    alt: "Flying Relaxed Carpenter Jeans",
    productId: "ts-004",
  },
];

export const FlyingWearHero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart, products } = useStore();

  const currentItem = FLYING_WEAR_ITEMS[activeIdx];
  const linkedProduct = products.find((p) => p.id === currentItem.productId) || products[0];

  // Scroll Parallax Hooks for the flying animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets as user scrolls
  const flyingY = useTransform(scrollYProgress, [0, 1], [-25, 45]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const rotateDeg = useTransform(scrollYProgress, [0, 1], [-3, 6]);
  const floatingShadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.9]);

  const handleQuickAdd = () => {
    if (linkedProduct) {
      addToCart(linkedProduct, linkedProduct.sizes[0] || "40R", linkedProduct.colors[0]?.name || "Deep Burgundy", 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#FAF7F5] via-[#F4EFEA]/80 to-[#FAF7F5] p-6 sm:p-10 flex flex-col justify-between min-h-[540px] sm:min-h-[600px] select-none"
    >
      {/* Ambient Radial Luxury Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(107,29,36,0.06),transparent_70%)]" />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-burgundy/5 blur-3xl pointer-events-none" />

      {/* Top Header Controls: Badge & Wear Selector */}
      <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-burgundy">
            {currentItem.category} • Flying Wear
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-ivory/90 backdrop-blur-md p-1 rounded-full shadow-sm">
          {FLYING_WEAR_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all ${
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

      {/* Main Flying Showcase Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 sm:my-8">
        {/* Floating Garment with Scroll Physics */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.88, y: 30, rotate: -6 }}
            animate={{
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
            }}
            exit={{ opacity: 0, scale: 0.88, y: -30, rotate: 6, transition: { duration: 0.3 } }}
            style={{ y: flyingY, rotate: rotateDeg }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing"
            whileHover={{ scale: 1.05 }}
          >
            {/* The Transparent Flying Wear PNG */}
            <img
              src={currentItem.pngSrc}
              alt={currentItem.alt}
              className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(43,8,10,0.22)] pointer-events-none"
              loading="eager"
            />

            {/* Dynamic Floating Shadow on Ground */}
            <motion.div
              style={{ scale: floatingShadowScale }}
              className="absolute -bottom-8 w-44 sm:w-56 h-6 rounded-full bg-espresso/20 blur-md pointer-events-none"
            />

            {/* Floating Editorial Badge Over the Garment */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:flex absolute -right-6 top-8 bg-ivory/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-burgundy/20 shadow-lg items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] font-bold text-espresso tracking-wide">
                {currentItem.tag}
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Floating Details & Action Bar */}
      <div className="relative z-20 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-espresso">
              {currentItem.name}
            </h3>
            <span className="text-xs sm:text-sm font-serif font-bold text-burgundy">
              ${currentItem.price}
            </span>
            <span className="text-xs text-espresso/40 line-through">
              ${currentItem.originalPrice}
            </span>
          </div>
          <p className="text-xs text-espresso/70 font-light max-w-md">
            {currentItem.spec}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleQuickAdd}
            className="flex-1 sm:flex-initial py-2.5 px-5 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md group"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
            <span>Claim Piece</span>
          </button>

          <Link
            href={`/product/${currentItem.productId}`}
            className="py-2.5 px-4 border border-burgundy/30 hover:border-burgundy text-espresso hover:text-burgundy text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
