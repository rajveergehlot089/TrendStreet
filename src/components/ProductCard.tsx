"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star, Check } from "lucide-react";
import { Product } from "@/types/store";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/pricing";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || "Default");
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-burgundy/10 shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-ivory-dark block">
        {/* Badges: New / Best Seller / Sale */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 pointer-events-none">
          {product.isNew && (
            <span className="bg-espresso text-ivory text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-xs">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-burgundy text-gold text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-xs">
              Top
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-crimson text-ivory text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-xs">
              Save {formatPrice(product.originalPrice - product.price)}
            </span>
          )}
        </div>

        {/* Wishlist Button (Touch friendly >= 44px hit area) */}
        <button
          onClick={handleHeartClick}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited
              ? "bg-crimson text-ivory shadow-md scale-105"
              : "bg-white/80 backdrop-blur-sm text-espresso hover:text-crimson hover:bg-white"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>

        {/* Product Images (with smooth crossfade on hover) */}
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Desktop Quick View & Add Bar (Hover on desktop only) */}
        <div className="hidden sm:flex absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center gap-2">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 bg-espresso/90 hover:bg-espresso text-ivory text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-sm transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-gold" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            className={`py-2 px-3 text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-sm transition-colors flex items-center justify-center shadow-lg ${
              isAdded
                ? "bg-green-700 text-white"
                : "bg-burgundy hover:bg-crimson text-gold"
            }`}
            title="Quick Add"
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </Link>

      {/* Product Content Details — Compact Mobile Padding & Typography */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-espresso/60 mb-0.5">
            <span className="uppercase tracking-wider font-semibold text-burgundy/80">
              {product.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-gold text-gold" />
              <span className="font-semibold text-espresso">{product.rating}</span>
            </div>
          </div>

          {/* Name & Subtitle */}
          <Link href={`/product/${product.id}`} className="group/title">
            <h3 className="font-serif text-xs sm:text-base font-bold text-espresso group-hover/title:text-crimson transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] sm:text-xs text-espresso/60 mt-0.5 line-clamp-1 italic">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing, Swatches & Mobile Quick-Add Button */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-burgundy/10 flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5 sm:space-x-2">
            <span className="text-xs sm:text-base font-bold text-burgundy">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-espresso/40 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Touch-Friendly Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`sm:hidden p-1.5 rounded-md flex items-center justify-center transition-colors shadow-xs ${
              isAdded ? "bg-green-700 text-white" : "bg-burgundy text-gold"
            }`}
            aria-label="Add to bag"
          >
            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>

          {/* Mini Color Swatches (Desktop) */}
          <div className="hidden sm:flex items-center space-x-1.5">
            {product.colors.slice(0, 3).map((col) => (
              <span
                key={col.name}
                title={col.name}
                className="w-3 h-3 rounded-full border border-black/20 shadow-xs"
                style={{ backgroundColor: col.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-espresso/50 font-medium">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
