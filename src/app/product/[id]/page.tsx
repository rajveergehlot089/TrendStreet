"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Scissors,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Sparkles,
  ArrowLeft,
  Eye,
  Box,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart, toggleWishlist, isInWishlist } = useStore();

  const product = products.find((p) => p.id === id) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || "");
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [show3DPreview, setShow3DPreview] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Accordion open states
  const [openSection, setOpenSection] = useState<string | null>("details");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-espresso">Product Not Found</h2>
        <Link href="/shop" className="mt-4 inline-block text-burgundy underline">
          Return to Sartorial Collection
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0]?.name, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-espresso/60">
        <Link href="/" className="hover:text-burgundy">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-burgundy">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-burgundy">
          {product.category}
        </Link>
        <span>/</span>
        <span className="font-semibold text-espresso truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery & 3D Toggle */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-ivory-dark border border-burgundy/15 shadow-lg">
            {show3DPreview ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-espresso text-ivory p-8 text-center space-y-4">
                <Box className="w-16 h-16 text-gold animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-widest text-gold">
                  3D Interactive Sartorial Silhouette
                </span>
                <p className="text-xs text-ivory/80 max-w-sm">
                  Rotational 360-degree fabric simulation engineered in WebGL. Experience the natural roll of the lapel and drape of {product.fabric}.
                </p>
                <div className="p-3 bg-burgundy/40 rounded-xl border border-gold/30 text-[11px] text-gold">
                  ✦ Vitale Barberis 160s Weave Structure Verified
                </div>
              </div>
            ) : (
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-espresso text-ivory text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded shadow">
                  New Arrival
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-burgundy text-gold text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded shadow">
                  Savile Row Classic
                </span>
              )}
            </div>

            {/* 3D vs Photo View Mode Switcher */}
            <div className="absolute top-4 right-4 z-10 flex items-center bg-espresso/80 backdrop-blur-md rounded-full p-1 border border-gold/30">
              <button
                onClick={() => setShow3DPreview(false)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  !show3DPreview ? "bg-burgundy text-gold" : "text-ivory/70 hover:text-ivory"
                }`}
              >
                Photography
              </button>
              <button
                onClick={() => setShow3DPreview(true)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                  show3DPreview ? "bg-burgundy text-gold" : "text-ivory/70 hover:text-ivory"
                }`}
              >
                <Box className="w-3 h-3 text-gold" />
                <span>3D View</span>
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {!show3DPreview && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? "border-burgundy shadow-md scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sartorial Details & Purchasing */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header / Title */}
            <div>
              <div className="flex items-center justify-between text-xs text-espresso/70 mb-1">
                <span className="font-bold uppercase tracking-[0.2em] text-crimson">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1.5">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-bold text-espresso">{product.rating}</span>
                  <span className="text-espresso/50">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-espresso/70 italic mt-1">{product.subtitle}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-3xl font-bold text-burgundy">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-base text-espresso/40 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-green-800 bg-green-100 px-2 py-0.5 rounded font-semibold">
                Import Taxes Included
              </span>
            </div>

            <p className="text-xs text-espresso/80 leading-relaxed pt-1">
              {product.description}
            </p>

            {/* Color Swatch Picker */}
            <div className="pt-2">
              <span className="text-xs font-bold text-espresso block mb-2">
                Color: <span className="font-semibold text-burgundy">{selectedColor || product.colors[0]?.name}</span>
              </span>
              <div className="flex items-center space-x-3">
                {product.colors.map((color) => {
                  const isSelected = (selectedColor || product.colors[0]?.name) === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-burgundy ring-2 ring-burgundy/30 scale-110 shadow-sm"
                          : "border-black/20 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-espresso mb-2">
                <span>Select Tailoring Size</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-burgundy flex items-center gap-1 hover:underline text-[11px]"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Smart Fit Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = (selectedSize || product.sizes[0]) === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs font-bold rounded-lg border transition-all ${
                        isSelected
                          ? "bg-burgundy text-gold border-burgundy shadow-sm"
                          : "bg-white text-espresso border-burgundy/20 hover:border-burgundy"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-espresso/60 mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold" />
                <span>Complimentary custom sleeve & trouser hem tailoring included with purchase.</span>
              </p>
            </div>

            {/* Actions: Add to Bag, Quantity, Wishlist */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-burgundy/30 rounded-lg bg-white px-3 py-3 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-espresso/70 hover:text-burgundy font-bold px-1"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-espresso">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-espresso/70 hover:text-burgundy font-bold px-1"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 px-6 rounded-lg text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl ${
                    addedAnimation
                      ? "bg-green-800 text-white"
                      : "bg-burgundy hover:bg-crimson text-gold"
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Sartorial Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Bag — ${(product.price * quantity).toLocaleString()}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-lg border transition-colors ${
                    isFavorited
                      ? "bg-crimson text-ivory border-crimson shadow-md"
                      : "bg-white text-espresso border-burgundy/20 hover:text-crimson"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                </button>
              </div>

              <Link
                href="/checkout"
                onClick={() => addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0]?.name, quantity)}
                className="w-full block text-center py-3 bg-espresso hover:bg-black text-ivory text-xs font-bold uppercase tracking-[0.18em] rounded-lg transition-colors"
              >
                Instant Express Checkout
              </Link>
            </div>

            {/* Atelier Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-burgundy/15 text-[11px] text-espresso/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Complimentary VIP Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Complimentary Alterations</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold flex-shrink-0" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Certified Genuine Noble Mill</span>
              </div>
            </div>

            {/* Expandable Accordions */}
            <div className="pt-4 divide-y divide-burgundy/15 border-t border-burgundy/15">
              {/* Accordion 1: Details & Tailoring */}
              <div className="py-3">
                <button
                  onClick={() => toggleSection("details")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-espresso text-left"
                >
                  <span>Atelier Tailoring & Construction</span>
                  {openSection === "details" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === "details" && (
                  <ul className="mt-3 space-y-1.5 text-xs text-espresso/75 pl-4 list-disc">
                    {product.details.map((det, i) => (
                      <li key={i}>{det}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Accordion 2: Fabric & Mill */}
              <div className="py-3">
                <button
                  onClick={() => toggleSection("fabric")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-espresso text-left"
                >
                  <span>Fabric & European Mill Provenance</span>
                  {openSection === "fabric" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === "fabric" && (
                  <div className="mt-3 space-y-2 text-xs text-espresso/75">
                    <p className="font-semibold text-burgundy">{product.fabric}</p>
                    <p>
                      Milled and finished exclusively in Biella, Italy and Yorkshire, England. Woven on traditional shuttle looms to preserve the inherent elasticity and breathability of pure natural fibers.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Garment Care */}
              <div className="py-3">
                <button
                  onClick={() => toggleSection("care")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-espresso text-left"
                >
                  <span>Garment Care & Longevity</span>
                  {openSection === "care" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === "care" && (
                  <ul className="mt-3 space-y-1.5 text-xs text-espresso/75 pl-4 list-disc">
                    {product.careInstructions.map((care, i) => (
                      <li key={i}>{care}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-burgundy/15 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-espresso">
              Frequently Styled With
            </h3>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-burgundy hover:text-crimson">
              View All In {product.category}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Smart Fit Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-ivory rounded-2xl max-w-2xl w-full p-8 border border-burgundy/20 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-burgundy/20">
              <h3 className="font-serif text-xl font-bold text-espresso">
                Trend Street Smart Fit Guide
              </h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-espresso/60 hover:text-burgundy">
                ✕
              </button>
            </div>

            <p className="text-xs text-espresso/80">
              Our tailoring uses British chest sizing with Italian drop-6 tapering. For a slim architectural silhouette, choose your regular chest size. For a relaxed layered drape, size up one unit.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-burgundy text-gold">
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest (in/cm)</th>
                    <th className="p-2.5">Waist (in/cm)</th>
                    <th className="p-2.5">Shoulder</th>
                    <th className="p-2.5">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-burgundy/15 bg-white">
                  <tr>
                    <td className="p-2.5 font-bold">38R</td>
                    <td className="p-2.5">38" / 96 cm</td>
                    <td className="p-2.5">31" / 79 cm</td>
                    <td className="p-2.5">17.5"</td>
                    <td className="p-2.5">33.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">40R</td>
                    <td className="p-2.5">40" / 102 cm</td>
                    <td className="p-2.5">33" / 84 cm</td>
                    <td className="p-2.5">18.0"</td>
                    <td className="p-2.5">34.0"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">42R</td>
                    <td className="p-2.5">42" / 107 cm</td>
                    <td className="p-2.5">35" / 89 cm</td>
                    <td className="p-2.5">18.5"</td>
                    <td className="p-2.5">34.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">44R</td>
                    <td className="p-2.5">44" / 112 cm</td>
                    <td className="p-2.5">37" / 94 cm</td>
                    <td className="p-2.5">19.0"</td>
                    <td className="p-2.5">35.0"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-3 bg-burgundy text-ivory text-xs font-bold uppercase rounded-lg"
            >
              Close Fit Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
