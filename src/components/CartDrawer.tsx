"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/pricing";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    products,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    addToCart,
    cartSubtotal,
    cartTotal,
    cartShipping,
    cartDiscount,
  } = useStore();

  // Escape key listener for cart dismissal
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1999;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Recommended coordinating cross-sell item not yet in cart (OFFCULT / Off Duty style)
  const crossSellProduct =
    products.find((p) => !cart.some((c) => c.product.id === p.id)) || products[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-ivory shadow-2xl flex flex-col border-l border-burgundy/20 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-burgundy/15 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-burgundy" />
              <h2 className="text-base font-serif font-bold uppercase tracking-wider text-espresso">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-espresso/60 hover:text-burgundy rounded transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter with Blue Dart Express Air Branding */}
          <div className="p-4 bg-ivory-dark border-b border-burgundy/10 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-espresso/80 font-medium mb-1.5 flex items-center gap-1.5 flex-wrap">
                <Truck className="w-3.5 h-3.5 text-burgundy" />
                <span>
                  Add <span className="font-bold text-burgundy">{formatPrice(remainingForFreeShipping)}</span> more to unlock Complimentary Blue Dart Apex Air.
                </span>
              </p>
            ) : (
              <p className="text-green-800 font-bold flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Unlocked! Complimentary Blue Dart Apex Air Priority Across India.</span>
              </p>
            )}
            <div
              role="progressbar"
              aria-valuenow={cartSubtotal}
              aria-valuemin={0}
              aria-valuemax={freeShippingThreshold}
              aria-label="Free shipping progress"
              className="w-full bg-burgundy/15 h-2 rounded-full overflow-hidden"
            >
              <div
                className="bg-burgundy h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-espresso/60">
                <div className="w-16 h-16 rounded-full bg-ivory-dark flex items-center justify-center text-burgundy/40 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-espresso mb-1">
                  Your Sartorial Bag is Empty
                </h3>
                <p className="text-xs text-espresso/60 max-w-xs mb-6">
                  Discover our architectural oversized hoodies, bootcut selvedge denim, boxy knitwear, and flight jackets.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-burgundy hover:bg-crimson text-ivory text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex space-x-3.5 p-3 bg-white rounded-lg border border-burgundy/10 shadow-sm"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-18 h-22 object-cover object-center rounded bg-ivory-dark flex-shrink-0 border border-burgundy/10"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif text-xs sm:text-sm font-bold text-espresso line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.product.id, item.selectedSize, item.selectedColor)
                            }
                            className="text-espresso/40 hover:text-crimson p-1 -mr-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-espresso/60 mt-0.5 font-mono">
                          Size: <span className="font-bold text-burgundy">{item.selectedSize}</span> | {item.selectedColor}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-ivory-dark">
                        <div className="flex items-center border border-burgundy/20 rounded bg-ivory">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity - 1
                              )
                            }
                            className="p-1 hover:text-burgundy text-espresso/70"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-espresso font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:text-burgundy text-espresso/70"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-burgundy">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coordinating Cross-Sell Piece ("Complete Your Fit") */}
                {crossSellProduct && (
                  <div className="p-3.5 rounded-xl bg-white border border-burgundy/15 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-burgundy uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-crimson" />
                        <span>Complete Your Fit</span>
                      </span>
                      <span className="text-[10px] text-espresso/50 font-normal">Coordinating Item</span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={crossSellProduct.images[0]}
                          alt={crossSellProduct.name}
                          className="w-12 h-14 object-cover rounded bg-ivory-dark border border-burgundy/10 flex-shrink-0"
                        />
                        <div>
                          <h5 className="font-serif text-xs font-bold text-espresso line-clamp-1">
                            {crossSellProduct.name}
                          </h5>
                          <span className="text-xs font-bold text-burgundy block">
                            {formatPrice(crossSellProduct.price)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addToCart(
                            crossSellProduct,
                            crossSellProduct.sizes[0] || "M",
                            crossSellProduct.colors[0]?.name || "Default",
                            1
                          )
                        }
                        className="py-1.5 px-3 bg-burgundy hover:bg-crimson text-gold text-[10px] font-bold uppercase tracking-wider rounded transition-colors whitespace-nowrap shadow-sm flex-shrink-0"
                      >
                        + Add ({crossSellProduct.sizes[0] || "M"})
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-burgundy/15 space-y-3.5">
              <div className="space-y-1.5 text-xs text-espresso/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-espresso">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-crimson font-medium">
                    <span>VIP Privilege Discount</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Blue Dart Apex Priority</span>
                  <span className={cartShipping === 0 ? "text-green-800 font-bold" : ""}>
                    {cartShipping === 0 ? "Complimentary" : formatPrice(cartShipping)}
                  </span>
                </div>
                <div className="pt-2 border-t border-ivory-dark flex justify-between text-base font-bold text-burgundy">
                  <span>Estimated Total (Incl. GST)</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/bag"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-lg border border-burgundy text-burgundy hover:bg-burgundy/5 text-xs font-semibold uppercase tracking-wider text-center transition-colors"
                >
                  View Bag
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-lg bg-burgundy hover:bg-crimson text-ivory text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-espresso/50 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                <span>256-Bit SSL Encrypted Luxury Atelier Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
