"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Ruler,
  Award,
  Calendar,
  CheckCircle,
  Truck,
  Shield,
  Save,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function ProfilePage() {
  const { user, orders, updateUserProfile } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "measurements" | "addresses" | "membership">("orders");

  // Editable measurements state
  const [measurements, setMeasurements] = useState(user.measurements);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ measurements });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-burgundy/15 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-full bg-burgundy text-gold font-serif font-bold text-2xl flex items-center justify-center shadow-lg border-2 border-gold/40">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-espresso">{user.name}</h1>
              <span className="bg-burgundy/10 text-burgundy text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-burgundy/20">
                {user.vipTier.split("(")[0]}
              </span>
            </div>
            <p className="text-xs text-espresso/60 mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        {/* VIP Reward Points */}
        <div className="flex items-center space-x-4 bg-ivory p-4 rounded-2xl border border-burgundy/10">
          <Award className="w-8 h-8 text-gold" />
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider text-espresso/60 font-semibold block">
              Atelier Sartorial Points
            </span>
            <span className="text-xl font-bold text-burgundy font-serif">
              {user.rewardPoints.toLocaleString()} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-burgundy/15 flex space-x-6 text-xs font-bold uppercase tracking-wider overflow-x-auto pb-1">
        {[
          { id: "orders", label: `Order History (${orders.length})`, icon: Package },
          { id: "measurements", label: "Bespoke Measurements", icon: Ruler },
          { id: "addresses", label: "Delivery Addresses", icon: MapPin },
          { id: "membership", label: "VIP Privileges", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as unknown as "orders" | "measurements" | "addresses" | "membership")}
              className={`pb-3 flex items-center space-x-2 transition-colors relative whitespace-nowrap ${
                isActive
                  ? "text-burgundy border-b-2 border-burgundy font-extrabold"
                  : "text-espresso/60 hover:text-burgundy"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-burgundy/15 p-8">
              <p className="font-serif text-lg font-bold text-espresso">No Orders Recorded</p>
              <p className="text-xs text-espresso/60 mt-1">Your placed garments will appear here with live tracking.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-burgundy/15 p-6 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-dark gap-2">
                  <div>
                    <span className="text-xs font-bold text-burgundy font-mono block">
                      Order #{ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-espresso/60">
                      Placed on {new Date(ord.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        ord.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-burgundy/10 text-burgundy border border-burgundy/20"
                      }`}
                    >
                      {ord.status}
                    </span>

                    <span className="text-sm font-bold text-espresso">
                      ${ord.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3.5 p-3 bg-ivory rounded-xl border border-burgundy/10">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-18 object-cover rounded bg-ivory-dark flex-shrink-0"
                      />
                      <div className="text-xs space-y-0.5">
                        <h4 className="font-serif font-bold text-espresso line-clamp-1">{item.productName}</h4>
                        <p className="text-[11px] text-espresso/60">
                          Size: {item.selectedSize} | Color: {item.selectedColor}
                        </p>
                        <p className="font-bold text-burgundy">${item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking info */}
                <div className="p-3 bg-ivory-dark rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs text-espresso/70 gap-2">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-gold" />
                    <span>Courier Tracking: <strong className="font-mono text-espresso">{ord.trackingNumber}</strong></span>
                  </div>

                  <Link
                    href={`/order-confirmation/${ord.id}`}
                    className="text-burgundy font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View Full Receipt</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: BESPOKE MEASUREMENTS PROFILE */}
      {activeTab === "measurements" && (
        <div className="bg-white rounded-3xl border border-burgundy/15 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-burgundy/10 gap-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-espresso">
                Personalized Tailoring Specifications
              </h3>
              <p className="text-xs text-espresso/60 mt-0.5">
                Our master tailors reference these exact measurements for complimentary alterations.
              </p>
            </div>
            {isSaved && (
              <span className="text-xs font-bold text-green-800 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Measurements Updated
              </span>
            )}
          </div>

          <form onSubmit={handleSaveMeasurements} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block font-semibold text-espresso mb-1">Standard Jacket Size</label>
              <input
                type="text"
                value={measurements.jacketSize}
                onChange={(e) => setMeasurements({ ...measurements, jacketSize: e.target.value })}
                className="w-full bg-ivory px-3.5 py-2.5 rounded-lg border border-burgundy/20 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-espresso mb-1">Chest Circumference</label>
              <input
                type="text"
                value={measurements.chest}
                onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                className="w-full bg-ivory px-3.5 py-2.5 rounded-lg border border-burgundy/20 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-espresso mb-1">Trouser Waist</label>
              <input
                type="text"
                value={measurements.waist}
                onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                className="w-full bg-ivory px-3.5 py-2.5 rounded-lg border border-burgundy/20 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-espresso mb-1">Trouser Inseam (Leg Length)</label>
              <input
                type="text"
                value={measurements.inseam}
                onChange={(e) => setMeasurements({ ...measurements, inseam: e.target.value })}
                className="w-full bg-ivory px-3.5 py-2.5 rounded-lg border border-burgundy/20 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-espresso mb-1">Shirt Collar Size</label>
              <input
                type="text"
                value={measurements.collar}
                onChange={(e) => setMeasurements({ ...measurements, collar: e.target.value })}
                className="w-full bg-ivory px-3.5 py-2.5 rounded-lg border border-burgundy/20 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-espresso mb-1">Shoe Size & Last</label>
              <input
                type="text"
                value={measurements.shoeSize}
                onChange={(e) => setMeasurements({ ...measurements, shoeSize: e.target.value })}
                className="w-full bg-ivory px-3.5 py-2.5 rounded-lg border border-burgundy/20 font-medium"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 pt-4 flex justify-end">
              <button
                type="submit"
                className="py-3 px-8 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Sartorial Measurements</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ADDRESSES */}
      {activeTab === "addresses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {user.savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-6 rounded-2xl border-2 bg-white space-y-3 ${
                addr.isDefault ? "border-burgundy" : "border-ivory-dark"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-base text-espresso">{addr.label}</span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold uppercase bg-burgundy/10 text-burgundy px-2.5 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-espresso/70 leading-relaxed">
                <strong>{addr.fullName}</strong><br />
                {addr.address}<br />
                {addr.city}, {addr.postalCode}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: VIP MEMBERSHIP */}
      {activeTab === "membership" && (
        <div className="bg-espresso text-ivory rounded-3xl p-8 sm:p-12 border border-burgundy/30 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3 text-gold">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-[0.25em]">
              Exclusive Atelier Benefits
            </span>
          </div>

          <h3 className="font-serif text-3xl font-bold text-ivory">
            Burgundy Connoisseur Privileges
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
            <div className="p-5 bg-burgundy/30 rounded-xl border border-gold/20 space-y-2">
              <h4 className="font-bold text-gold uppercase tracking-wider">
                Private Trunk Shows
              </h4>
              <p className="text-ivory/80 leading-relaxed">
                First-look preview reservations for new seasonal collections 72 hours before general public release.
              </p>
            </div>

            <div className="p-5 bg-burgundy/30 rounded-xl border border-gold/20 space-y-2">
              <h4 className="font-bold text-gold uppercase tracking-wider">
                Savile Row Master Alterations
              </h4>
              <p className="text-ivory/80 leading-relaxed">
                Zero alteration fees on all suits, blazers, and trousers with dedicated concierge dispatch.
              </p>
            </div>

            <div className="p-5 bg-burgundy/30 rounded-xl border border-gold/20 space-y-2">
              <h4 className="font-bold text-gold uppercase tracking-wider">
                Direct Atelier Stylist Access
              </h4>
              <p className="text-ivory/80 leading-relaxed">
                Direct WhatsApp and video consultation with our head pattern maker for customized fittings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
