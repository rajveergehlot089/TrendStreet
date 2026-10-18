import React from "react";

export const StoreJsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Trend Street",
    alternateName: "The Style Hub",
    description:
      "Premier luxury menswear fashion house specializing in Savile Row tailoring, Italian noble fabrics, handcrafted footwear, and bespoke seasonal lookbooks.",
    url: "https://trendstreet.com",
    logo: "https://trendstreet.com/logo.png",
    priceRange: "$$$$",
    currenciesAccepted: "USD, GBP, EUR",
    paymentAccepted: "Credit Card, Debit Card, Apple Pay, Google Pay, UPI",
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Savile Row, Mayfair",
      addressLocality: "London",
      postalCode: "W1S 3JN",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "51.5113",
      longitude: "-0.1415",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-20-7946-0912",
      contactType: "customer service",
      availableLanguage: ["English", "Italian", "French"],
    },
    sameAs: [
      "https://www.instagram.com/trendstreet",
      "https://twitter.com/trendstreet",
      "https://facebook.com/trendstreet",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
