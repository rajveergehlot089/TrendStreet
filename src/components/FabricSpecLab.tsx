"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  Info,
  CheckCircle2,
  Cpu,
} from "lucide-react";

interface FabricSpec {
  id: string;
  name: string;
  gsm: string;
  yarnCount: string;
  origin: string;
  silhouette: "Oversized" | "Jeans" | "Boxy Fit" | "Jackets";
  targetRoute: string;
  thicknessMm: number;
  drapeScore: number;
  thermalScore: number;
  durabilityYears: string;
  description: string;
  fastFashionComparison: string;
  features: string[];
  swatchHex: string;
  image: string;
}

const FABRIC_SPECS: FabricSpec[] = [
  {
    id: "combed-320",
    name: "Ultra-Heavy Combed Cotton",
    gsm: "320 GSM",
    yarnCount: "16s Ring-Spun Compact",
    origin: "Coimbatore Mills, Tamil Nadu",
    silhouette: "Oversized",
    targetRoute: "/oversized",
    thicknessMm: 0.85,
    drapeScore: 9.4,
    thermalScore: 6.8,
    durabilityYears: "7+ Years",
    description:
      "Engineered from 100% extra-long staple combed cotton. Unlike flimsy commercial tees, our 320gsm knit holds a structured boxy drape off the shoulders without collapsing against the chest.",
    fastFashionComparison:
      "Standard retail t-shirts weigh 160–180gsm, shrink after 2 washes, and drape limp. Our 320gsm combed knit maintains an architectural silhouette all day.",
    features: [
      "Zero-shrink pre-steamed compact jersey",
      "3.2cm reinforced double-needle rib collar",
      "Ring-spun yarn eliminating fabric pilling",
      "Blind-stitched sleeve and torso hem",
    ],
    swatchHex: "#4A1216",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "loopback-520",
    name: "Japanese Loopback French Terry",
    gsm: "520 GSM",
    yarnCount: "3-End French Terry Weave",
    origin: "Wakayama & Mumbai Precision Mills",
    silhouette: "Oversized",
    targetRoute: "/oversized",
    thicknessMm: 1.45,
    drapeScore: 9.8,
    thermalScore: 8.9,
    durabilityYears: "10+ Years",
    description:
      "A monumental 1.4kg garment weight. Milled on slow rotary circular knitting machines with unbrushed interior loops for natural thermal micro-regulation.",
    fastFashionComparison:
      "Commercial hoodies average 280–320gsm with synthetic polyester fleece backing that pills. Our 520gsm terry is 100% pure organic cotton with a self-standing hood.",
    features: [
      "Double-walled structural hood with no drawstrings",
      "Unbrushed high-density interior loops for breathability",
      "Hidden interior seam pocket with bar-tack reinforcement",
      "Pre-shrunk garment dyed in small atelier batches",
    ],
    swatchHex: "#2B080A",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "selvedge-15oz",
    name: "Okayama Redline Selvedge Denim",
    gsm: "15.0 OZ (425 GSM)",
    yarnCount: "Toyoda G9 Shuttle Loom Raw",
    origin: "Kuroki Mill, Okayama, Japan",
    silhouette: "Jeans",
    targetRoute: "/jeans",
    thicknessMm: 1.15,
    drapeScore: 9.6,
    thermalScore: 7.5,
    durabilityYears: "15+ Years",
    description:
      "Slow-woven on vintage 1950s Toyoda automatic shuttle looms. Features the iconic redline self-edge ticker ID, natural slub texture, and pure indigo rope dyeing.",
    fastFashionComparison:
      "Fast-fashion stretch denim uses open-end projectile looms with 2% elastane that bags out at the knees in 6 months. Okayama selvedge molds uniquely to your gait over years.",
    features: [
      "Authentic Redline Selvedge ID visible on turn-up cuffs",
      "Union Special 43200G chainstitched roping hem",
      "Hand-peened copper rivets from Okayama",
      "Natural slub warp with zero synthetic elastane",
    ],
    swatchHex: "#1C2A39",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "wool-700",
    name: "Double-Faced Melton Wool & Cashmere",
    gsm: "700 GSM",
    yarnCount: "Super 120s Double-Woven",
    origin: "Biella, Northern Italy",
    silhouette: "Jackets",
    targetRoute: "/jackets",
    thicknessMm: 2.1,
    drapeScore: 9.9,
    thermalScore: 9.7,
    durabilityYears: "20+ Years",
    description:
      "The pinnacle of outerwear density. Woven in Biella, Italy using 90% heavy carded virgin wool bonded to 10% grade-A Mongolian cashmere for windproof insulation.",
    fastFashionComparison:
      "Commercial overcoats mix cheap polyester with chopped recycled wool fibers that disintegrate in rain. Our 700gsm Melton is naturally water-repellent and completely windproof.",
    features: [
      "Natural water-shedding lanolin-rich dense weave",
      "Horn button closures etched with Trend Street monogram",
      "Unconstructed architectural shoulder pads",
      "Satin cupro lining for frictionless sleeve layering",
    ],
    swatchHex: "#3A2A20",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
  },
];

export const FabricSpecLab: React.FC = () => {
  const [selectedFabric, setSelectedFabric] = useState<FabricSpec>(FABRIC_SPECS[0]);
  const [viewMode, setViewMode] = useState<"specs" | "anatomy">("specs");

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8" id="fabric-lab">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 pb-4 border-b border-burgundy/15 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5">
            <Cpu className="w-3.5 h-3.5 text-crimson" />
            <span>Heavyweight Material Engineering</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-espresso tracking-tight">
            The Fabric & Mill Lab
          </h2>
          <p className="text-xs sm:text-sm text-espresso/70 mt-1 max-w-xl font-light">
            We reject flimsy 160gsm commercial textiles. Explore the tactile weights, vintage shuttle looms, and mill provenance behind every Trend Street drop.
          </p>
        </div>

        {/* View Mode Toggle with Tab Accessibility */}
        <div
          role="tablist"
          aria-label="Fabric Lab View Modes"
          className="flex items-center bg-ivory-dark p-1 rounded-lg border border-burgundy/15 self-start md:self-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "specs"}
            onClick={() => setViewMode("specs")}
            className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              viewMode === "specs"
                ? "bg-burgundy text-gold shadow-sm"
                : "text-espresso/70 hover:text-espresso"
            }`}
          >
            GSM Comparison
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "anatomy"}
            onClick={() => setViewMode("anatomy")}
            className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              viewMode === "anatomy"
                ? "bg-burgundy text-gold shadow-sm"
                : "text-espresso/70 hover:text-espresso"
            }`}
          >
            Selvedge Anatomy
          </button>
        </div>
      </div>

      {viewMode === "specs" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Interactive Fabric Pill Selector */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-espresso/50 block px-1">
              Select Material Standard
            </span>

            {FABRIC_SPECS.map((fab) => {
              const isSelected = selectedFabric.id === fab.id;
              return (
                <button
                  key={fab.id}
                  type="button"
                  onClick={() => setSelectedFabric(fab)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-white border-burgundy shadow-md ring-1 ring-burgundy/20"
                      : "bg-white/60 border-burgundy/10 hover:border-burgundy/30 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                      style={{ backgroundColor: fab.swatchHex }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-espresso group-hover:text-crimson transition-colors">
                          {fab.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-burgundy tracking-wider block">
                        {fab.gsm} • {fab.silhouette}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-burgundy text-gold"
                          : "bg-ivory-dark text-espresso/60"
                      }`}
                    >
                      {fab.origin.split(",")[0]}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Quick Fast-Fashion Comparison Banner */}
            <div className="mt-4 p-4 rounded-xl bg-burgundy/5 border border-burgundy/15 space-y-2">
              <div className="flex items-center gap-2 text-burgundy font-bold text-xs uppercase tracking-wider">
                <Info className="w-4 h-4 text-crimson flex-shrink-0" />
                <span>Industry Weight Baseline</span>
              </div>
              <div className="space-y-1.5 text-xs text-espresso/80">
                <div className="flex justify-between py-1 border-b border-burgundy/10 text-[11px]">
                  <span className="text-espresso/60">Standard Mall Tee:</span>
                  <span className="font-mono font-bold text-espresso/60">140–180 GSM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-burgundy/10 text-[11px]">
                  <span className="text-espresso/60">Commercial Hoodie:</span>
                  <span className="font-mono font-bold text-espresso/60">280–320 GSM</span>
                </div>
                <div className="flex justify-between py-1 text-[11px] font-bold text-burgundy">
                  <span>Trend Street Standard:</span>
                  <span className="font-mono">320–700 GSM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Spec Card with Metrics & Fast Fashion Delta */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-burgundy/15 shadow-sm p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-burgundy/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-espresso text-gold text-[10px] font-mono font-bold uppercase tracking-widest">
                    {selectedFabric.gsm}
                  </span>
                  <span className="text-xs text-espresso/60 uppercase tracking-wider font-semibold">
                    {selectedFabric.yarnCount}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso mt-1.5">
                  {selectedFabric.name}
                </h3>
                <span className="text-xs text-burgundy font-medium">
                  Milled exclusively in {selectedFabric.origin}
                </span>
              </div>

              <Link
                href={selectedFabric.targetRoute}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-5 bg-burgundy hover:bg-crimson text-ivory text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm"
              >
                <span>Shop {selectedFabric.silhouette}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-espresso/80 leading-relaxed font-light">
              {selectedFabric.description}
            </p>

            {/* Tactile Performance Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-xl bg-ivory-dark/70 border border-burgundy/10">
              <div>
                <span className="text-[10px] text-espresso/60 uppercase tracking-wider block">
                  Caliper Gauge
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-burgundy">
                  {selectedFabric.thicknessMm} mm
                </span>
                <span className="text-[10px] text-espresso/50 block">Single Layer</span>
              </div>

              <div>
                <span className="text-[10px] text-espresso/60 uppercase tracking-wider block">
                  Drape Rigidity
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-burgundy">
                  {selectedFabric.drapeScore} / 10
                </span>
                <span className="text-[10px] text-espresso/50 block">Structured Anti-Cling</span>
              </div>

              <div>
                <span className="text-[10px] text-espresso/60 uppercase tracking-wider block">
                  Thermal Factor
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-burgundy">
                  {selectedFabric.thermalScore} / 10
                </span>
                <span className="text-[10px] text-espresso/50 block">Microclimate Comfort</span>
              </div>

              <div>
                <span className="text-[10px] text-espresso/60 uppercase tracking-wider block">
                  Tested Longevity
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-burgundy">
                  {selectedFabric.durabilityYears}
                </span>
                <span className="text-[10px] text-espresso/50 block">Zero Bagging</span>
              </div>
            </div>

            {/* Fast Fashion Delta Callout (Offcult / Off Duty contrast style) */}
            <div className="p-4 rounded-xl bg-espresso text-ivory space-y-2 border border-burgundy/30">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-crimson" />
                <span>The Engineering Difference</span>
              </span>
              <p className="text-xs text-ivory/85 leading-relaxed font-light">
                {selectedFabric.fastFashionComparison}
              </p>
            </div>

            {/* Atelier Construction Features */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-espresso block mb-3">
                Atelier Craftsmanship Highlights:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedFabric.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-espresso/80">
                    <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Selvedge Anatomy Interactive Blueprint */
        <div className="bg-white rounded-2xl border border-burgundy/15 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-crimson">
              Shuttle Loom Engineering • Kuroki Mill, Okayama
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso mt-1">
              Anatomy of Okayama Redline Selvedge
            </h3>
            <p className="text-xs sm:text-sm text-espresso/70 mt-2 font-light leading-relaxed">
              Every pair of Trend Street denim is cut from Japanese 14.5oz–15oz raw selvedge denim woven on restored vintage Toyoda G9 shuttle looms. Here is what separates raw shuttle loom denim from modern mass-market jeans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-ivory border border-burgundy/15 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-burgundy text-gold font-mono font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h4 className="font-serif text-base font-bold text-espresso">
                Toyoda G9 Shuttle Weave
              </h4>
              <p className="text-xs text-espresso/75 leading-relaxed font-light">
                Vintage wooden shuttles cross back and forth at low speed under low warp tension. This deliberate friction creates an irregular, tactile surface texture (&ldquo;slub&rdquo;) that cannot be replicated by computerized projectile looms.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-ivory border border-burgundy/15 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-burgundy text-gold font-mono font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h4 className="font-serif text-base font-bold text-espresso">
                Redline Self-Finished Edge
              </h4>
              <p className="text-xs text-espresso/75 leading-relaxed font-light">
                &ldquo;Self-edge&rdquo; (selvedge) means the outer edge of the fabric is naturally tightly bound and completely fray-proof. Our signature Japanese crimson ticker thread is visible when cuffed or stacked over footwear.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-ivory border border-burgundy/15 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-burgundy text-gold font-mono font-bold text-xs flex items-center justify-center">
                03
              </div>
              <h4 className="font-serif text-base font-bold text-espresso">
                Union Special 43200G Chainstitch
              </h4>
              <p className="text-xs text-espresso/75 leading-relaxed font-light">
                Hems are sewn on vintage 1940s Union Special sewing machines. The heavy chainstitch pulls on the denim hem on a diagonal bias as it shrinks, creating the coveted &ldquo;roping&rdquo; fade pattern around the leg opening.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-burgundy text-ivory flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                Heavyweight Denim Lineup
              </span>
              <h5 className="font-serif text-lg font-bold">
                Experience 15oz Baggy, Barrel & Bootcut Cuts
              </h5>
              <p className="text-xs text-ivory/80 font-light">
                Available in sizes 28 to 38 waist with customizable inseams.
              </p>
            </div>
            <Link
              href="/jeans"
              className="py-3 px-6 bg-gold hover:bg-gold-light text-espresso font-bold text-xs uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shadow-md"
            >
              Shop Selvedge Denim
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
