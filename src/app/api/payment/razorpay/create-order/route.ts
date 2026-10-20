import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder, getRazorpayEnvironment } from "@/lib/razorpay";
import { calculateOrderPricing, PricingItem } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, promoCode, deliveryMethod = "standard", currency = "INR" } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart cannot be empty for Razorpay order generation." },
        { status: 400 }
      );
    }

    // 1. Convert cart items to PricingItem interface
    const pricingItems: PricingItem[] = items.map((it: any) => ({
      id: it.productId || it.id,
      name: it.productName || it.name || "Luxury Garment",
      unitPriceMinor: Math.round(Number(it.price || it.unitPriceMinor || 0) * 100),
      quantity: Math.max(1, Number(it.quantity || 1)),
      size: it.selectedSize || it.size || "M",
      color: it.selectedColor || it.color || "Standard",
    }));

    // 2. Server-authoritative price calculation
    const pricing = calculateOrderPricing(pricingItems, {
      promoCode,
      deliveryMethod,
      currency: "INR",
    });

    if (pricing.totalMinor <= 0) {
      return NextResponse.json(
        { error: "Calculated order total must be greater than zero." },
        { status: 400 }
      );
    }

    const receipt = `TS-${Date.now()}`;

    // 3. Create server-side order with Razorpay
    const env = getRazorpayEnvironment();
    const { order, keyId, isTestMode } = await createRazorpayOrder({
      amountMinor: pricing.totalMinor,
      currency: "INR",
      receipt,
      notes: {
        receiptNumber: receipt,
        subtotal: String(pricing.subtotalMinor),
        promoCode: pricing.promoCodeApplied || "none",
        discount: String(pricing.discountMinor),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt,
      keyId,
      isTestMode,
      pricing: {
        subtotalMinor: pricing.subtotalMinor,
        discountMinor: pricing.discountMinor,
        shippingMinor: pricing.shippingMinor,
        taxMinor: pricing.taxMinor,
        totalMinor: pricing.totalMinor,
        isFreeShipping: pricing.isFreeShipping,
      },
    });
  } catch (error: any) {
    console.error("[Razorpay Order Creation Error]:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to initialize Razorpay order.",
        details: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
