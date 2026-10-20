/**
 * Trend Street — Server-Authoritative Pricing & Checkout Calculation Engine
 * All monetary calculations are performed in integer minor units (cents / paise)
 * to strictly prevent IEEE 754 floating-point rounding inaccuracies.
 */

export interface PricingItem {
  id: string;
  name: string;
  unitPriceMinor: number; // e.g. 16000 for $160.00
  quantity: number;
  size: string;
  color: string;
}

export interface PricingOptions {
  promoCode?: string | null;
  deliveryMethod?: "standard" | "express" | "vip_courier";
  taxRateBasisPoints?: number; // e.g., 800 for 8.00%, 1800 for 18.00%
  currency?: "USD" | "INR";
}

export interface PricingSummary {
  currency: "USD" | "INR";
  subtotalMinor: number;
  discountMinor: number;
  shippingMinor: number;
  taxMinor: number;
  totalMinor: number;
  promoCodeApplied: string | null;
  discountPercent: number;
  isFreeShipping: boolean;
}

// Active Promo Code Registry with discount percentages (Paise / Cents)
export const VALID_PROMO_CODES: Record<string, { percent: number; description: string; minSpendMinor: number }> = {
  TREND10: { percent: 10, description: "10% off inaugural order over ₹1,999", minSpendMinor: 199900 },
  STREET20: { percent: 20, description: "20% off seasonal drop orders over ₹3,999", minSpendMinor: 399900 },
  VIP15: { percent: 15, description: "15% VIP atelier patron discount over ₹2,499", minSpendMinor: 249900 },
  FREESHIP: { percent: 0, description: "Complimentary priority shipping on all orders", minSpendMinor: 0 },
};

// Shipping rules: Orders >= ₹1,999 (199,900 paise) receive complimentary courier across India
export const FREE_SHIPPING_THRESHOLD_MINOR = 199900;
export const SHIPPING_RATES_MINOR: Record<"standard" | "express" | "vip_courier", number> = {
  standard: 15000, // ₹150.00
  express: 25000,  // ₹250.00
  vip_courier: 35000, // ₹350.00
};

/**
 * Calculates complete order pricing breakdown server-side.
 */
export function calculateOrderPricing(
  items: PricingItem[],
  options: PricingOptions = {}
): PricingSummary {
  const currency = options.currency || "INR";
  const deliveryMethod = options.deliveryMethod || "standard";
  // GST 12% standard for Indian apparel (1200 bps)
  const taxRateBps = options.taxRateBasisPoints ?? 1200;

  if (!items || items.length === 0) {
    return {
      currency,
      subtotalMinor: 0,
      discountMinor: 0,
      shippingMinor: 0,
      taxMinor: 0,
      totalMinor: 0,
      promoCodeApplied: null,
      discountPercent: 0,
      isFreeShipping: false,
    };
  }

  // 1. Server Subtotal (minor units)
  const subtotalMinor = items.reduce((acc, item) => {
    const qty = Math.max(1, Math.floor(item.quantity));
    const price = Math.max(0, Math.floor(item.unitPriceMinor));
    return acc + price * qty;
  }, 0);

  // 2. Promo code validation & discount
  let promoCodeApplied: string | null = null;
  let discountPercent = 0;
  let discountMinor = 0;

  if (options.promoCode) {
    const normalizedCode = options.promoCode.trim().toUpperCase();
    const coupon = VALID_PROMO_CODES[normalizedCode];

    if (coupon && subtotalMinor >= coupon.minSpendMinor) {
      promoCodeApplied = normalizedCode;
      discountPercent = coupon.percent;
      discountMinor = Math.round((subtotalMinor * coupon.percent) / 100);
    }
  }

  const discountedSubtotalMinor = Math.max(0, subtotalMinor - discountMinor);

  // 3. Shipping threshold (threshold met OR FREESHIP coupon applied)
  const isFreeShipping =
    discountedSubtotalMinor >= FREE_SHIPPING_THRESHOLD_MINOR ||
    promoCodeApplied === "FREESHIP";
  const baseShipping = SHIPPING_RATES_MINOR[deliveryMethod] || SHIPPING_RATES_MINOR.standard;
  const shippingMinor = isFreeShipping ? 0 : baseShipping;

  // 4. Tax calculation (applied on discounted goods)
  const taxMinor = Math.round((discountedSubtotalMinor * taxRateBps) / 10000);

  // 5. Total
  const totalMinor = discountedSubtotalMinor + shippingMinor + taxMinor;

  return {
    currency,
    subtotalMinor,
    discountMinor,
    shippingMinor,
    taxMinor,
    totalMinor,
    promoCodeApplied,
    discountPercent,
    isFreeShipping,
  };
}

/**
 * Formats minor units for display (e.g., 16000 -> "$160.00" or "₹16,000")
 */
export function formatMinorUnits(amountMinor: number, currency: "USD" | "INR" = "INR"): string {
  const major = amountMinor / 100;

  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(major);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major);
}

/**
 * Formats major units for display (e.g., 2499 -> "₹2,499")
 */
export function formatPrice(amountMajor: number, currency: "USD" | "INR" = "INR"): string {
  return formatMinorUnits(Math.round(amountMajor * 100), currency);
}

