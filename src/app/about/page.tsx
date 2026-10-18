"use client";

import React from "react";
import Link from "next/link";
import {
  Scissors,
  Award,
  Globe,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Banner */}
      <section className="bg-espresso text-ivory py-20 border-b border-burgundy/40 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold block">
            Atelier Heritage & Sartorial Standards
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            The Philosophy of <br />
            <span className="text-gold italic font-normal">Trend Street</span>
          </h1>
          <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-light max-w-xl mx-auto">
            Founded with an uncompromising belief that true masculine elegance is born from architectural structure, unhurried handcraft, and pure noble textiles.
          </p>
        </div>
      </section>

      {/* 2. The Dialogue Between Savile Row and Milan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-crimson block">
              Architectural Tailoring
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
              Where British Canvas Structure Meets Italian Sprezzatura
            </h2>
            <p className="text-xs sm:text-base text-espresso/80 leading-relaxed font-light">
              For generations, gentlemen were forced to choose between the razor-sharp, heavily armored structure of British Savile Row suiting and the relaxed, featherlight softness of Neapolitan tailoring.
            </p>
            <p className="text-xs sm:text-base text-espresso/80 leading-relaxed font-light">
              Trend Street was founded to dissolve that binary. We engineered a proprietary soft-shoulder construction featuring a fully floating natural horsehair and camel-wool canvas. The result is a jacket that commands the boardroom with British poise while breathing like a second skin under Mediterranean sun.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-burgundy/15">
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop"
                alt="Trend Street Tailor Workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Four Mill Partners */}
      <section className="bg-white py-16 border-y border-burgundy/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-crimson block">
              Noble Fiber Provenance
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
              Historic European Mill Partnerships
            </h2>
            <p className="text-xs text-espresso/70">
              We never blend synthetics. Every yard of fabric originates from dedicated family weavers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-ivory rounded-2xl border border-burgundy/15 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy block">
                Biella, Piedmont, Italy
              </span>
              <h3 className="font-serif text-xl font-bold text-espresso">
                Vitale Barberis Canonico (Est. 1663)
              </h3>
              <p className="text-xs text-espresso/70 leading-relaxed">
                Weaving Super 150s and Super 160s virgin wools washed in the mineral-rich glacial waters of the Piedmontese Alps for incomparable luster and resilience.
              </p>
            </div>

            <div className="p-8 bg-ivory rounded-2xl border border-burgundy/15 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy block">
                Yorkshire, England
              </span>
              <h3 className="font-serif text-xl font-bold text-espresso">
                Huddersfield Flannel Weavers
              </h3>
              <p className="text-xs text-espresso/70 leading-relaxed">
                Creators of substantial 340gsm and 380gsm pure woolen flannels that offer unrivaled thermal insulation, structured lapel roll, and decades of shape retention.
              </p>
            </div>

            <div className="p-8 bg-ivory rounded-2xl border border-burgundy/15 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy block">
                Bergamo, Italy
              </span>
              <h3 className="font-serif text-xl font-bold text-espresso">
                Thomas Mason (Est. 1796)
              </h3>
              <p className="text-xs text-espresso/70 leading-relaxed">
                Spinners of two-ply 140/2 extra-long staple Egyptian Giza 45 and West Indian Sea Island cotton for dress shirts that feel like liquid silk against the chest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Atelier Concierge Contact */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-espresso text-ivory p-8 sm:p-12 rounded-3xl border border-burgundy/30 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold block">
              Private Sartorial Appointments
            </span>
            <h3 className="font-serif text-3xl font-bold text-ivory">
              Trend Street Mayfair Atelier
            </h3>
            <p className="text-xs text-ivory/80 max-w-md mx-auto">
              Our master tailors and private stylists are available for bespoke fitting appointments, wedding party consultations, and wardrobe curation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-center border-t border-burgundy/30 pt-8">
            <div className="space-y-2">
              <MapPin className="w-5 h-5 text-gold mx-auto" />
              <strong className="block text-ivory font-bold">Mayfair Headquarters</strong>
              <p className="text-ivory/70">14 Savile Row, Mayfair<br />London, W1S 3JN</p>
            </div>

            <div className="space-y-2">
              <Phone className="w-5 h-5 text-gold mx-auto" />
              <strong className="block text-ivory font-bold">Private Concierge Line</strong>
              <p className="text-ivory/70">+44 20 7946 0912<br />Mon–Sat: 9AM – 7PM GMT</p>
            </div>

            <div className="space-y-2">
              <Mail className="w-5 h-5 text-gold mx-auto" />
              <strong className="block text-ivory font-bold">Bespoke Inquiries</strong>
              <p className="text-ivory/70">concierge@trendstreet.com<br />vip@trendstreet.com</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 py-3.5 px-8 bg-burgundy hover:bg-crimson text-gold text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-colors shadow-lg"
            >
              <span>Explore The Ready-to-Wear Atelier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
