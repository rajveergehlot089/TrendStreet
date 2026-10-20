import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const processedEventIds = new Set<string>();

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Webhook handler for payment providers (Razorpay & Stripe).
 * Enforces cryptographic HMAC-SHA256 signature verification with constant-time comparison
 * and idempotent event processing.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const rawSignature = req.headers.get("x-razorpay-signature") || req.headers.get("stripe-signature");

    if (!rawSignature) {
      console.warn("[Webhook] Missing payment gateway signature header.");
      return NextResponse.json(
        { error: "Signature verification failed: Missing signature header." },
        { status: 400 }
      );
    }

    // Extract signature hash: supports pure hex (Razorpay) and scheme-tagged format (Stripe v1)
    let signature = rawSignature.trim();
    if (rawSignature.includes("v1=")) {
      const match = rawSignature.match(/v1=([a-f0-9]+)/i);
      if (match) {
        signature = match[1];
      }
    }

    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      if (process.env.NODE_ENV === "production") {
        console.error("[FATAL SECURITY] PAYMENT_WEBHOOK_SECRET is unset in production environment.");
        return NextResponse.json(
          { error: "Payment webhook secret is unconfigured." },
          { status: 500 }
        );
      }
      console.info("[Webhook] Received payload in non-production mode without configured secret.");
      return NextResponse.json(
        { received: true, note: "Webhook received in staging mode. Configure PAYMENT_WEBHOOK_SECRET for production." },
        { status: 200 }
      );
    }

    // Node Web Crypto HMAC verification
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
    const expectedSigHex = Array.from(new Uint8Array(expectedSigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (!constantTimeEqual(expectedSigHex, signature)) {
      console.warn("[Webhook] Cryptographic signature mismatch detected.");
      return NextResponse.json(
        { error: "Invalid cryptographic signature." },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.id || payload?.payload?.payment?.entity?.id || null;

    // Idempotency check: prevent duplicate order credit
    if (eventId && processedEventIds.has(eventId)) {
      console.info(`[Webhook] Duplicate event received and acknowledged idempotently: ${eventId}`);
      return NextResponse.json({ success: true, duplicate: true }, { status: 200 });
    }

    if (eventId) {
      processedEventIds.add(eventId);
      // Bound the set size to 10,000 entries
      if (processedEventIds.size > 10000) {
        const firstKey = processedEventIds.values().next().value;
        if (firstKey) processedEventIds.delete(firstKey);
      }
    }

    console.info(`[Webhook] Verified event: ${payload.event || payload.type || "unknown"}`);

    // If payment captured/paid, update database status
    const eventType = payload.event || payload.type || "";
    if (eventType === "payment.captured" || eventType === "order.paid" || eventType === "payment_intent.succeeded") {
      try {
        const { PrismaClient, OrderStatus, PaymentStatus } = await import("@prisma/client");
        const prisma = new PrismaClient();
        const paymentEntity = payload?.payload?.payment?.entity || payload?.data?.object || {};
        const razorpayOrderId = paymentEntity.order_id || null;
        const razorpayPaymentId = paymentEntity.id || null;

        if (razorpayOrderId || razorpayPaymentId) {
          const paymentRecord = await prisma.payment.findFirst({
            where: {
              OR: [
                razorpayOrderId ? { gatewayOrderId: razorpayOrderId } : {},
                razorpayPaymentId ? { gatewayPaymentId: razorpayPaymentId } : {},
              ],
            },
          });

          if (paymentRecord) {
            await prisma.payment.update({
              where: { id: paymentRecord.id },
              data: { status: PaymentStatus.CAPTURED },
            });
            const updatedOrder = await prisma.order.update({
              where: { id: paymentRecord.orderId },
              data: { status: OrderStatus.CONFIRMED },
              include: {
                user: true,
                shippingAddress: true,
                items: {
                  include: {
                    variant: {
                      include: {
                        product: true,
                      },
                    },
                  },
                },
              },
            });
            console.info(`[Webhook] Successfully confirmed order ${paymentRecord.orderId} in database.`);

            // Trigger transactional order confirmation email if customer email exists
            if (updatedOrder?.user?.email) {
              const { sendOrderConfirmationEmail } = await import("@/lib/email");
              sendOrderConfirmationEmail({
                orderNumber: updatedOrder.orderNumber,
                orderId: updatedOrder.id,
                customerName: updatedOrder.user.name || "Valued Patron",
                customerEmail: updatedOrder.user.email,
                items: updatedOrder.items.map((it) => ({
                  productName: it.variant.product.name,
                  size: it.variant.size,
                  color: it.variant.colorName,
                  quantity: it.quantity,
                  unitPrice: it.unitPrice / 100,
                })),
                subtotal: updatedOrder.subtotal / 100,
                discount: updatedOrder.discountAmount / 100,
                shipping: updatedOrder.shippingAmount / 100,
                tax: updatedOrder.taxAmount / 100,
                total: updatedOrder.totalAmount / 100,
                promoCode: updatedOrder.promoCode || undefined,
                paymentMethod: paymentRecord.provider === "RAZORPAY" ? "Razorpay (UPI / Card)" : "Online Payment",
                paymentGatewayId: paymentRecord.gatewayPaymentId || undefined,
                shippingAddress: {
                  street: updatedOrder.shippingAddress?.street || "Atelier Handover",
                  apartment: updatedOrder.shippingAddress?.apartment || undefined,
                  city: updatedOrder.shippingAddress?.city || "Mumbai",
                  state: updatedOrder.shippingAddress?.state || "Maharashtra",
                  postalCode: updatedOrder.shippingAddress?.postalCode || "400050",
                  country: updatedOrder.shippingAddress?.country || "India",
                },
                deliveryCourier: updatedOrder.deliveryCourier || "Blue Dart Apex / Delhivery Air",
              }).catch((emailErr) => {
                console.warn("[Webhook Resend Background Warning]:", emailErr?.message || emailErr);
              });
            }
          }
        }
        await prisma.$disconnect();
      } catch (dbErr) {
        console.warn("[Webhook Database Update Warning]:", dbErr);
      }
    }

    return NextResponse.json({ success: true, processed: true }, { status: 200 });
  } catch (error) {
    console.error("[Webhook] Processing failure:", error);
    return NextResponse.json(
      { error: "Webhook processing internal error." },
      { status: 500 }
    );
  }
}
