import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { PrismaClient, OrderStatus, PaymentStatus, PaymentProvider } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required Razorpay payment signature parameters." },
        { status: 400 }
      );
    }

    // 1. Constant-time cryptographic HMAC-SHA256 signature verification
    const isValidSignature = verifyRazorpayPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValidSignature) {
      console.warn(
        `[Razorpay Signature Verification Failed] Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`
      );
      return NextResponse.json(
        { error: "Payment verification failed: Invalid cryptographic signature." },
        { status: 400 }
      );
    }

    console.info(
      `[Razorpay Signature Verified Successfully] Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`
    );

    // 2. Persist to Supabase PostgreSQL database via Prisma (if orderData provided)
    let dbOrderNumber = `TS-${Date.now().toString().slice(-6)}`;

    if (orderData) {
      try {
        const customerEmail = orderData.customer?.email || "guest@trendstreet.in";
        const customerName = orderData.customer?.fullName || "Guest Customer";
        const customerPhone = orderData.customer?.phone || "+91 98200 12345";

        // Find or create customer
        const user = await prisma.user.upsert({
          where: { email: customerEmail },
          update: { name: customerName, phone: customerPhone },
          create: {
            email: customerEmail,
            name: customerName,
            phone: customerPhone,
            role: "CUSTOMER",
          },
        });

        // Create shipping address
        const address = await prisma.address.create({
          data: {
            userId: user.id,
            fullName: customerName,
            phone: customerPhone,
            street: orderData.customer?.address || "Atelier Delivery",
            apartment: orderData.customer?.apartment || null,
            city: orderData.customer?.city || "Mumbai",
            state: orderData.customer?.state || "Maharashtra",
            postalCode: orderData.customer?.postalCode || "400050",
            country: orderData.customer?.country || "IN",
          },
        });

        // Create verified Order
        const order = await prisma.order.create({
          data: {
            orderNumber: dbOrderNumber,
            userId: user.id,
            shippingAddressId: address.id,
            status: OrderStatus.CONFIRMED,
            currency: "INR",
            subtotal: orderData.pricing?.subtotalMinor || Math.round((orderData.subtotal || 0) * 100),
            discountAmount: orderData.pricing?.discountMinor || Math.round((orderData.discount || 0) * 100),
            shippingAmount: orderData.pricing?.shippingMinor || Math.round((orderData.shipping || 0) * 100),
            taxAmount: orderData.pricing?.taxMinor || Math.round((orderData.tax || 0) * 100),
            totalAmount: orderData.pricing?.totalMinor || Math.round((orderData.total || 0) * 100),
            promoCode: orderData.promoCode || null,
            deliveryCourier: "Blue Dart Apex / Delhivery Air",
            payments: {
              create: {
                provider: PaymentProvider.RAZORPAY,
                gatewayOrderId: razorpay_order_id,
                gatewayPaymentId: razorpay_payment_id,
                gatewaySignature: razorpay_signature,
                amount: orderData.pricing?.totalMinor || Math.round((orderData.total || 0) * 100),
                currency: "INR",
                status: PaymentStatus.CAPTURED,
              },
            },
          },
        });

        dbOrderNumber = order.orderNumber;

        // 3. Dispatch transactional confirmation email via Resend
        if (orderData.customer?.email) {
          sendOrderConfirmationEmail({
            orderNumber: dbOrderNumber,
            orderId: order.id,
            customerName: orderData.customer?.fullName || "Valued Patron",
            customerEmail: orderData.customer.email,
            items: (orderData.items || []).map((it: any) => ({
              productName: it.productName || it.name || "Luxury Streetwear Garment",
              size: it.selectedSize || it.size || "M",
              color: it.selectedColor || it.color || "Standard",
              quantity: Math.max(1, Number(it.quantity || 1)),
              unitPrice: Number(it.price || 0),
            })),
            subtotal: orderData.pricing?.subtotalMinor
              ? orderData.pricing.subtotalMinor / 100
              : orderData.subtotal || 0,
            discount: orderData.pricing?.discountMinor
              ? orderData.pricing.discountMinor / 100
              : orderData.discount || 0,
            shipping: orderData.pricing?.shippingMinor
              ? orderData.pricing.shippingMinor / 100
              : orderData.shipping || 0,
            tax: orderData.pricing?.taxMinor
              ? orderData.pricing.taxMinor / 100
              : orderData.tax || 0,
            total: orderData.pricing?.totalMinor
              ? orderData.pricing.totalMinor / 100
              : orderData.total || 0,
            promoCode: orderData.promoCode,
            paymentMethod: "Razorpay (Instant UPI / Card / Net Banking)",
            paymentGatewayId: razorpay_payment_id,
            shippingAddress: {
              street: orderData.customer?.address || "Atelier Delivery",
              apartment: orderData.customer?.apartment || undefined,
              city: orderData.customer?.city || "Mumbai",
              state: orderData.customer?.state || "Maharashtra",
              postalCode: orderData.customer?.postalCode || "400050",
              country: orderData.customer?.country || "India",
            },
            deliveryCourier: "Blue Dart Apex / Delhivery Air",
          }).catch((emailErr) => {
            console.warn("[Resend Verify Background Warning]:", emailErr?.message || emailErr);
          });
        }
      } catch (dbError) {
        console.error("[Database Persistence Warning]:", dbError);
        // Signature was still mathematically verified
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      orderNumber: dbOrderNumber,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      message: "Razorpay payment signature verified successfully.",
    });
  } catch (error: any) {
    console.error("[Razorpay Verify Error]:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification encountered an internal error." },
      { status: 500 }
    );
  }
}
