"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
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
    name: "The Tuscan Suede Flight Jacket",
    category: "Jackets Capsule",
    price: 480,
    originalPrice: 540,
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
    price: 340,
    originalPrice: 380,
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
    price: 320,
    originalPrice: 360,
    tag: "14.5oz Okayama Selvedge",
    spec: "Subtle ankle bootcut flare resting effortlessly over sneakers",
    pngSrc: "/flying-wear-jeans.png",
    alt: "Flying Okayama Bootcut Flare Jeans",
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

  const shouldReduceMotion = useReducedMotion();

  const handleQuickAdd = () => {
    if (linkedProduct) {
      addToCart(linkedProduct, linkedProduct.sizes[0] || (linkedProduct.category === "Jeans" ? "32" : "M"), linkedProduct.colors[0]?.name || "Deep Burgundy", 1);
    }
  };

  return (
    <>
      {/* DESKTOP VIEW (md: and above): Pure 3D Textured Floating Garment, Zero Borders Around Clothes */}
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
              {currentItem.category} • 3D Textile Weave
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
              key={currentItem.id}
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
                src={currentItem.pngSrc}
                alt={currentItem.alt}
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
                  {currentItem.tag}
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
                {currentItem.name}
              </h3>
              <span className="text-sm font-serif font-bold text-burgundy">
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className="py-2.5 px-5 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-md group"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
              <span>Claim Piece</span>
            </button>

            <Link
              href={`/product/${currentItem.productId}`}
              className="py-2.5 px-4 bg-ivory/80 hover:bg-ivory text-espresso hover:text-burgundy text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
