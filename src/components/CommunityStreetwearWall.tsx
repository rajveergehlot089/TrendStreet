"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  Ruler,
  Heart,
} from "lucide-react";

interface CommunityFit {
  id: string;
  customerName: string;
  city: string;
  height: string;
  weight: string;
  purchasedProduct: string;
  category: "Oversized" | "Jeans" | "Boxy Fit" | "Jackets";
  targetRoute: string;
  sizePurchased: string;
  rating: number;
  drapeVerdict: string;
  stackingReview: string;
  image: string;
  likesCount: number;
}

const COMMUNITY_FITS: CommunityFit[] = [
  {
    id: "fit-1",
    customerName: "Kabir Mehta",
    city: "Bandra West, Mumbai",
    height: "6'1\" (185 cm)",
    weight: "78 kg",
    purchasedProduct: "The Mayfair Heavyweight Tee",
    category: "Oversized",
    targetRoute: "/product/ts-001",
    sizePurchased: "XL (Relaxed Drape)",
    rating: 5.0,
    drapeVerdict: "The 320gsm cotton is so rigid it doesn't cling to the stomach at all. True boxy drop.",
    stackingReview: "Dropped shoulder seam hits at the midpoint of the bicep. Holds shape in Mumbai humidity.",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop",
    likesCount: 142,
  },
  {
    id: "fit-2",
    customerName: "Aryan Sehgal",
    city: "Hauz Khas, New Delhi",
    height: "5'10\" (178 cm)",
    weight: "72 kg",
    purchasedProduct: "The Shibuya Baggy Carpenter Denim",
    category: "Jeans",
    targetRoute: "/product/ts-003",
    sizePurchased: "32W x 32L",
    rating: 5.0,
    drapeVerdict: "Substantial 14.5oz shuttle loom stiffness. Beautiful redline selvedge cuff roll.",
    stackingReview: "Gives a clean 2-break stack over Jordan 1s without scraping the heel on the street.",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
    likesCount: 219,
  },
  {
    id: "fit-3",
    customerName: "Rohan Devanahalli",
    city: "Indiranagar, Bengaluru",
    height: "6'0\" (182 cm)",
    weight: "76 kg",
    purchasedProduct: "The Tokyo Drop-Shoulder Hoodie",
    category: "Oversized",
    targetRoute: "/product/ts-002",
    sizePurchased: "L (Substantial Box)",
    rating: 5.0,
    drapeVerdict: "The double-walled hood actually stands upright without sagging. Insane 520gsm weight.",
    stackingReview: "Heaviest hoodie I own. Feels like luxury Japanese streetwear at 1/3 the price.",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    likesCount: 188,
  },
  {
    id: "fit-4",
    customerName: "Aditya Kulkarni",
    city: "Koregaon Park, Pune",
    height: "5'9\" (175 cm)",
    weight: "68 kg",
    purchasedProduct: "The Shoreditch Boxy Knit Tee",
    category: "Boxy Fit",
    targetRoute: "/product/ts-005",
    sizePurchased: "M (Cropped Box)",
    rating: 4.9,
    drapeVerdict: "Cropped waistband lands right at the belt line. Perfect with high-rise baggy jeans.",
    stackingReview: "Chest measurement is wide (46\") but body length is 26\". Exactly the Offcult silhouette.",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    likesCount: 97,
  },
  {
    id: "fit-5",
    customerName: "Veer Pratap Singh",
    city: "Sector 8, Chandigarh",
    height: "6'2\" (188 cm)",
    weight: "84 kg",
    purchasedProduct: "The Milan Minimalist Suede Bomber",
    category: "Jackets",
    targetRoute: "/product/ts-007",
    sizePurchased: "XL (Layered Flight Cut)",
    rating: 5.0,
    drapeVerdict: "Tuscan lambskin suede with thick wool ribbing. Cropped body with elongated sleeves.",
    stackingReview: "Worn over the 520gsm hoodie and fits seamlessly without binding under the arms.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    likesCount: 312,
  },
  {
    id: "fit-6",
    customerName: "Nikhil Varma",
    city: "Jubilee Hills, Hyderabad",
    height: "5'11\" (180 cm)",
    weight: "74 kg",
    purchasedProduct: "The Harajuku Barrel-Leg Skate Jeans",
    category: "Jeans",
    targetRoute: "/product/ts-004",
    sizePurchased: "32W (Curved Outseam)",
    rating: 5.0,
    drapeVerdict: "The curved barrel seam creates an exaggerated arch around the knee. Ultra-wide leg.",
    stackingReview: "Zero stretch means the denim keeps its architectural flare all day.",
    image:
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop",
    likesCount: 164,
  },
];

export const CommunityStreetwearWall: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const filteredFits =
    activeCategory === "All"
      ? COMMUNITY_FITS
      : COMMUNITY_FITS.filter((f) => f.category === activeCategory);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 pb-4 border-b border-burgundy/15 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-crimson" />
            <span>Real Body Dimensions & Street Proof</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-espresso tracking-tight">
            Worn On The Streets
          </h2>
          <p className="text-xs sm:text-sm text-espresso/70 mt-1 max-w-xl font-light">
            Verified client fit checks across India. Check real customer height, weight, and stacking photos before selecting your size.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center bg-ivory-dark p-1 rounded-lg border border-burgundy/15 self-start sm:self-auto overflow-x-auto no-scrollbar">
          {["All", "Oversized", "Jeans", "Boxy Fit", "Jackets"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-burgundy text-gold shadow-sm"
                  : "text-espresso/70 hover:text-espresso"
              }`}
            >
              {cat === "All" ? "All Street Fits" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Community Fits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredFits.map((fit) => {
          const isLiked = !!likedIds[fit.id];
          return (
            <div
              key={fit.id}
              className="bg-white rounded-2xl border border-burgundy/15 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              {/* Fit Image & Client Tag */}
              <div className="relative aspect-[4/5] bg-espresso overflow-hidden">
                <img
                  src={fit.image}
                  alt={`${fit.customerName} wearing ${fit.purchasedProduct}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-transparent opacity-85" />

                {/* Location Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-espresso text-[11px] font-bold shadow-sm">
                  <MapPin className="w-3 h-3 text-burgundy" />
                  <span>{fit.city}</span>
                </div>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => toggleLike(fit.id)}
                  aria-pressed={isLiked}
                  aria-label={isLiked ? `Unlike ${fit.customerName}'s fit check` : `Like ${fit.customerName}'s fit check`}
                  className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                    isLiked
                      ? "bg-crimson text-ivory shadow-md scale-105"
                      : "bg-white/80 text-espresso hover:bg-white"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                </button>

                {/* Overlay Fit Dimensions */}
                <div className="absolute bottom-3 left-3 right-3 z-10 text-ivory space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gold font-bold">
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{fit.height} • {fit.weight}</span>
                    </span>
                    <span className="bg-espresso/80 px-2 py-0.5 rounded border border-gold/30 text-[10px]">
                      Wearing {fit.sizePurchased}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold line-clamp-1">
                    {fit.customerName}
                  </h4>
                </div>
              </div>

              {/* Review & Styling Verdict */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                      <span className="text-xs font-bold text-espresso ml-1">
                        {fit.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-burgundy flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-700" />
                      <span>Verified Buyer</span>
                    </span>
                  </div>

                  <p className="text-xs text-espresso/85 italic leading-relaxed">
                    &ldquo;{fit.drapeVerdict}&rdquo;
                  </p>

                  <div className="p-2.5 rounded-lg bg-ivory-dark/60 text-[11px] text-espresso/70 space-y-0.5 border border-burgundy/10">
                    <span className="font-bold text-burgundy uppercase text-[10px] block">
                      Stacking & Hem Fit:
                    </span>
                    <p className="font-light">{fit.stackingReview}</p>
                  </div>
                </div>

                {/* Shop the Exact Item */}
                <div className="pt-3 border-t border-burgundy/10 flex items-center justify-between">
                  <div className="text-[11px]">
                    <span className="text-espresso/50 block">Featured Silhouette:</span>
                    <span className="font-semibold text-espresso">{fit.purchasedProduct}</span>
                  </div>
                  <Link
                    href={fit.targetRoute}
                    className="p-2 rounded-lg bg-burgundy hover:bg-crimson text-gold transition-colors"
                    title="Shop this exact silhouette"
                    aria-label={`Shop ${fit.purchasedProduct}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Callout Banner */}
      <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-espresso text-ivory flex flex-col sm:flex-row items-center justify-between gap-4 border border-burgundy/30">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold">
            Tag @trendstreet.in on Instagram
          </span>
          <h4 className="font-serif text-lg font-bold">
            Get Featured & Receive ₹500 Atelier Store Credit
          </h4>
          <p className="text-xs text-ivory/80 font-light">
            Upload your unboxing or street fit check with hashtag #TrendStreetFits. We credit verified buyers every Monday.
          </p>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-6 bg-gold hover:bg-gold-light text-espresso font-bold text-xs uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shadow-md"
        >
          Submit Fit Check
        </a>
      </div>
    </section>
  );
};
