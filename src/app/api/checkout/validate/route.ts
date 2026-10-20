import { NextRequest, NextResponse } from "next/server";
import { INITIAL_PRODUCTS } from "@/data/products";
import { calculateOrderPricing, PricingItem, formatMinorUnits } from "@/lib/pricing";

export const dynamic = "force-dynamic";

interface CheckoutValidateBody {
  items: Array<{
    productId: string;
    size: string;
    color: string;
    quantity: number;
  }>;
  promoCode?: string;
  deliveryMethod?: "standard" | "express" | "vip_courier";
  currency?: "USD" | "INR";
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutValidateBody = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Please select products to continue." },
        { status: 400 }
      );
    }

    // Build verified items list from server-side catalog (Never trust client prices)
    const verifiedPricingItems: PricingItem[] = [];
    const unavailableItems: string[] = [];

    for (const requestedItem of body.items) {
      const product = INITIAL_PRODUCTS.find((p) => p.id === requestedItem.productId);

      if (!product || !product.inStock) {
        unavailableItems.push(requestedItem.productId);
        continue;
      }

      // Convert major unit price to minor units (e.g. $160 -> 16000 cents)
      const unitPriceMinor = Math.round(product.price * 100);

      verifiedPricingItems.push({
        id: product.id,
        name: product.name,
        unitPriceMinor,
        quantity: Math.max(1, Math.min(10, requestedItem.quantity || 1)),
        size: requestedItem.size,
        color: requestedItem.color,
      });
    }

    if (verifiedPricingItems.length === 0) {
      return NextResponse.json(
        { error: "Selected items are no longer available.", unavailableItems },
        { status: 400 }
      );
    }

    // Calculate server authoritative breakdown
    const summary = calculateOrderPricing(verifiedPricingItems, {
      promoCode: body.promoCode,
      deliveryMethod: body.deliveryMethod || "standard",
      currency: body.currency || "INR",
    });

    return NextResponse.json({
      success: true,
      summary: {
        ...summary,
        formattedSubtotal: formatMinorUnits(summary.subtotalMinor, summary.currency),
        formattedDiscount: formatMinorUnits(summary.discountMinor, summary.currency),
        formattedShipping: formatMinorUnits(summary.shippingMinor, summary.currency),
        formattedTax: formatMinorUnits(summary.taxMinor, summary.currency),
        formattedTotal: formatMinorUnits(summary.totalMinor, summary.currency),
      },
      verifiedItems: verifiedPricingItems.map((item) => ({
        id: item.id,
        name: item.name,
        unitPriceMinor: item.unitPriceMinor,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        itemTotalMinor: item.unitPriceMinor * item.quantity,
      })),
      unavailableItems,
    });
  } catch (err) {
    console.error("Checkout validation error:", err);
    return NextResponse.json(
      { error: "Unable to calculate checkout summary." },
      { status: 500 }
    );
  }
}
