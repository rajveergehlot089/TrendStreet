"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowRight,
  Lock,
  Sparkles,
  Building2,
  QrCode,
  DollarSign,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    promoCode,
    createOrder,
    user,
  } = useStore();

  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user.name || "Julian Sterling",
    email: user.email || "julian.sterling@mayfair.co.uk",
    phone: user.phone || "+44 20 7946 0912",
    address: user.savedAddresses[0]?.address || "14 Savile Row, Mayfair",
    apartment: "Apartment 4B",
    city: user.savedAddresses[0]?.city || "London",
    postalCode: user.savedAddresses[0]?.postalCode || "W1S 3JN",
    country: "United Kingdom",
    deliveryMethod: "vip_courier" as "standard" | "express" | "vip_courier",
    paymentMethod: "card" as "card" | "upi" | "netbanking" | "cod",
    cardNumber: "4532 •••• •••• 8912",
    cardExp: "12/28",
    cardCvv: "892",
    cardName: "Julian Sterling",
    upiId: "sterling@okaxis",
    bankName: "Barclays Private Wealth",
  });

  const [step1Error, setStep1Error] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (step1Error) setStep1Error(null);
  };

  const validateAndProceedToStep2 = () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.postalCode.trim()
    ) {
      setStep1Error("Please complete all required shipping fields before continuing.");
      return false;
    }
    setStep1Error(null);
    setStep(2);
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      validateAndProceedToStep2();
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    handleSubmitOrder(e);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        image: item.product.images[0],
      }));

      const newOrder = createOrder({
        items: orderItems,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shipping: cartShipping,
        tax: cartTax,
        total: cartTotal,
        promoCode: promoCode || undefined,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
      });

      setIsProcessing(false);
      router.push(`/order-confirmation/${newOrder.id}`);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-espresso">Your Bag is Empty</h2>
        <p className="text-xs text-espresso/60">There are no items to checkout.</p>
        <Link
          href="/shop"
          className="inline-block py-3 px-6 bg-burgundy text-ivory text-xs font-bold uppercase rounded"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Progress Header */}
      <div className="pb-6 border-b border-burgundy/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson block mb-1">
            256-Bit SSL Encrypted
          </span>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Trend Street Atelier Checkout
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-3 text-xs font-semibold">
          <span
            className={`px-3 py-1 rounded-full ${
              step >= 1 ? "bg-burgundy text-gold font-bold" : "bg-ivory-dark text-espresso/50"
            }`}
          >
            1. Shipping
          </span>
          <span className="text-burgundy/40">→</span>
          <span
            className={`px-3 py-1 rounded-full ${
              step >= 2 ? "bg-burgundy text-gold font-bold" : "bg-ivory-dark text-espresso/50"
            }`}
          >
            2. Delivery
          </span>
          <span className="text-burgundy/40">→</span>
          <span
            className={`px-3 py-1 rounded-full ${
              step >= 3 ? "bg-burgundy text-gold font-bold" : "bg-ivory-dark text-espresso/50"
            }`}
          >
            3. Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Interactive Checkout Form */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-8 space-y-6">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-burgundy/15 shadow-xs space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
                <h3 className="font-serif text-lg font-bold text-espresso">
                  1. Shipping & Concierge Destination
                </h3>
                <span className="text-[11px] text-green-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
                </span>
              </div>

              {step1Error && (
                <div className="p-3 bg-crimson/10 border border-crimson/30 rounded-lg text-xs text-crimson font-medium">
                  {step1Error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-fullName" className="block font-semibold text-espresso mb-1">
                    Full Legal Name
                  </label>
                  <input
                    id="checkout-fullName"
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-ivory px-3.5 py-2.5 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-email" className="block font-semibold text-espresso mb-1">
                    Email Address (Order Confirmation)
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-ivory px-3.5 py-2.5 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="block font-semibold text-espresso mb-1">
                    Phone Number (Courier Dispatch)
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-ivory px-3.5 py-2.5 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="checkout-address" className="block font-semibold text-espresso mb-1">
                    Street Address
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-ivory px-3.5 py-2.5 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-apartment" className="block font-semibold text-espresso mb-1">
                    Apartment / Suite / Floor
                  </label>
                  <input
                    id="checkout-apartment"
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full bg-ivory px-3.5 py-2.5 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-city" className="block font-semibold text-espresso mb-1">
                    City
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-ivory px-3.5 py-2.5 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-postalCode" className="block font-semibold text-espresso mb-1">
                    Postal / ZIP Code
                  </label>
                  <input
                    id="checkout-postalCode"
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-ivory px-3.5 py-2.5 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-country" className="block font-semibold text-espresso mb-1">
                    Country / Region
                  </label>
                  <select
                    id="checkout-country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-ivory px-3.5 py-2.5 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy cursor-pointer"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Italy">Italy</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={validateAndProceedToStep2}
                  className="py-3 px-8 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY OPTIONS */}
          {step === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-burgundy/15 shadow-xs space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
                <h3 className="font-serif text-lg font-bold text-espresso">
                  2. Select Delivery Experience
                </h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-burgundy underline font-semibold"
                >
                  Edit Address
                </button>
              </div>

              <div className="space-y-3">
                {/* Method 1 */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    formData.deliveryMethod === "vip_courier"
                      ? "border-burgundy bg-burgundy/5 shadow-xs"
                      : "border-ivory-dark hover:border-burgundy/30 bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="vip_courier"
                      checked={formData.deliveryMethod === "vip_courier"}
                      onChange={handleChange}
                      className="text-burgundy focus:ring-burgundy w-4 h-4"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-espresso">
                          VIP Express Courier (DHL Express / FedEx Priority)
                        </span>
                        <span className="bg-gold text-espresso text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-espresso/70 mt-0.5">
                        Delivered within 48-72 hours in signature protective garment bag.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-800">Complimentary</span>
                </label>

                {/* Method 2 */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    formData.deliveryMethod === "standard"
                      ? "border-burgundy bg-burgundy/5 shadow-xs"
                      : "border-ivory-dark hover:border-burgundy/30 bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard"
                      checked={formData.deliveryMethod === "standard"}
                      onChange={handleChange}
                      className="text-burgundy focus:ring-burgundy w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-xs text-espresso">
                        Standard Carbon-Neutral Ground
                      </span>
                      <p className="text-[11px] text-espresso/70 mt-0.5">
                        Estimated arrival: 4–6 business days.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-800">Complimentary</span>
                </label>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-espresso hover:text-burgundy"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3 px-8 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD SIMULATION */}
          {step === 3 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-burgundy/15 shadow-xs space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
                <h3 className="font-serif text-lg font-bold text-espresso">
                  3. Payment Method
                </h3>
                <div className="flex items-center space-x-1.5 text-xs text-green-800 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure 256-Bit</span>
                </div>
              </div>

              {/* Payment Type Selection Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "upi", label: "Instant UPI", icon: QrCode },
                  { id: "netbanking", label: "Netbanking", icon: Building2 },
                  { id: "cod", label: "Cash on Delivery", icon: DollarSign },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = formData.paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: m.id as unknown as "card" | "upi" | "netbanking" | "cod" })}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? "bg-burgundy text-gold border-burgundy shadow-sm"
                          : "bg-ivory text-espresso border-burgundy/15 hover:border-burgundy"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[11px] font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card Inputs */}
              {formData.paymentMethod === "card" && (
                <div className="space-y-4 p-4 bg-ivory rounded-xl border border-burgundy/10 text-xs">
                  <div>
                    <label htmlFor="checkout-cardNumber" className="block font-semibold text-espresso mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-espresso/40" />
                      <input
                        id="checkout-cardNumber"
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full bg-white pl-10 pr-3 py-2 rounded border border-burgundy/20 text-espresso font-mono focus:outline-none focus:border-burgundy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="checkout-cardExp" className="block font-semibold text-espresso mb-1">
                        Expiry Date
                      </label>
                      <input
                        id="checkout-cardExp"
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleChange}
                        className="w-full bg-white px-3 py-2 rounded border border-burgundy/20 text-espresso font-mono focus:outline-none focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-cardCvv" className="block font-semibold text-espresso mb-1">
                        CVV / CVC
                      </label>
                      <input
                        id="checkout-cardCvv"
                        type="password"
                        name="cardCvv"
                        maxLength={4}
                        value={formData.cardCvv}
                        onChange={handleChange}
                        className="w-full bg-white px-3 py-2 rounded border border-burgundy/20 text-espresso font-mono focus:outline-none focus:border-burgundy"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-cardName" className="block font-semibold text-espresso mb-1">
                      Cardholder Name
                    </label>
                    <input
                      id="checkout-cardName"
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="w-full bg-white px-3 py-2 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                    />
                  </div>
                </div>
              )}

              {/* UPI Inputs */}
              {formData.paymentMethod === "upi" && (
                <div className="p-4 bg-ivory rounded-xl border border-burgundy/10 text-xs space-y-3">
                  <label htmlFor="checkout-upiId" className="block font-semibold text-espresso">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    id="checkout-upiId"
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="yourname@upi"
                    className="w-full bg-white px-3 py-2 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy"
                  />
                  <p className="text-[11px] text-espresso/60">
                    A collect request will be sent to your Google Pay, PhonePe, or BHIM app.
                  </p>
                </div>
              )}

              {/* Netbanking Inputs */}
              {formData.paymentMethod === "netbanking" && (
                <div className="p-4 bg-ivory rounded-xl border border-burgundy/10 text-xs space-y-3">
                  <label htmlFor="checkout-bankName" className="block font-semibold text-espresso">
                    Select Registered Banking Institution
                  </label>
                  <select
                    id="checkout-bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full bg-white px-3 py-2 rounded border border-burgundy/20 text-espresso focus:outline-none focus:border-burgundy cursor-pointer"
                  >
                    <option value="Barclays Private Wealth">Barclays Private Wealth</option>
                    <option value="Coutts & Co">Coutts & Co London</option>
                    <option value="JPMorgan Chase">JPMorgan Chase</option>
                    <option value="HSBC Premier">HSBC Premier</option>
                    <option value="HDFC Private Banking">HDFC Bank</option>
                  </select>
                </div>
              )}

              {/* COD Notice */}
              {formData.paymentMethod === "cod" && (
                <div className="p-4 bg-ivory rounded-xl border border-burgundy/10 text-xs space-y-1">
                  <span className="font-bold text-burgundy block">White-Glove Cash on Delivery</span>
                  <p className="text-espresso/70 text-[11px]">
                    Pay cash or via mobile terminal upon white-glove courier handover at your residence.
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-espresso hover:text-burgundy"
                >
                  ← Back to Delivery
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="py-4 px-10 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-all flex items-center gap-2 shadow-xl"
                >
                  {isProcessing ? (
                    <span>Securing Sartorial Allocation...</span>
                  ) : (
                    <>
                      <span>Complete Order — ${cartTotal.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-burgundy/15 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-espresso pb-2 border-b border-burgundy/10">
              Your Selection ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            <div className="divide-y divide-ivory-dark max-h-72 overflow-y-auto pr-1 space-y-3">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="pt-3 first:pt-0 flex items-center space-x-3"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-16 object-cover rounded bg-ivory-dark"
                  />
                  <div className="flex-1 text-xs">
                    <h5 className="font-serif font-bold text-espresso line-clamp-1">{item.product.name}</h5>
                    <p className="text-[11px] text-espresso/60">
                      Size: {item.selectedSize} × {item.quantity}
                    </p>
                    <span className="font-bold text-burgundy">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-espresso/80 pt-3 border-t border-burgundy/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartSubtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-crimson font-medium">
                  <span>VIP Discount ({promoCode})</span>
                  <span>-${cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Logistics</span>
                <span>{cartShipping === 0 ? "Complimentary" : `$${cartShipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tariffs & Taxes</span>
                <span>${cartTax.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-ivory-dark flex justify-between text-base font-bold text-burgundy">
                <span>Total Amount</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
