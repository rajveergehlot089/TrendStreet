import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "burgundy" | "ivory" | "gold" | "crimson";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "burgundy",
  size = "md",
  showTagline = true,
  className = "",
  href = "/",
}) => {
  const colorMap = {
    burgundy: {
      text: "#4A1216",
      tagline: "#6B1D24",
      bar: "#4A1216",
    },
    ivory: {
      text: "#F9F6F4",
      tagline: "#EBE5DF",
      bar: "#F9F6F4",
    },
    gold: {
      text: "#C5A880",
      tagline: "#D4AF37",
      bar: "#C5A880",
    },
    crimson: {
      text: "#6B1D24",
      tagline: "#4A1216",
      bar: "#6B1D24",
    },
  };

  const scaleMap = {
    sm: { width: 140, height: 42, titleSize: "text-lg", tagSize: "text-[8px]" },
    md: { width: 200, height: 60, titleSize: "text-2xl", tagSize: "text-[10px]" },
    lg: { width: 260, height: 78, titleSize: "text-3xl", tagSize: "text-xs" },
    xl: { width: 340, height: 100, titleSize: "text-4xl", tagSize: "text-sm" },
  };

  const colors = colorMap[variant];
  const dimensions = scaleMap[size];

  const content = (
    <div
      className={`inline-flex flex-col items-center select-none group transition-transform duration-300 ${className}`}
      style={{ minWidth: dimensions.width }}
    >
      <svg
        viewBox="0 0 340 100"
        className="w-full h-auto"
        style={{ maxWidth: dimensions.width }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Trend Street - The Style Hub"
      >
        {/* Top Decorative Flourish Bar over 'REND' */}
        <path
          d="M135 24 H258 V27 H135 Z"
          fill={colors.bar}
          className="transition-colors duration-300"
        />

        {/* Flourished Ornate 'T' Swash */}
        <path
          d="M74 38 C74 31 79 26 86 26 C93 26 97 30 97 35 C97 40 93 44 88 44 C82 44 80 40 80 37 C80 35 82 33 84 33 C86 33 87 34 87 36 C87 37 86 38 85 38 C84 38 84 37 84 36 C84 35 85 34 86 34 C84 34 82 35 82 37 C82 41 87 42 90 41 C94 40 96 36 96 32 C96 27 91 24 84 24 C74 24 67 31 67 40 C67 52 79 56 94 56 L108 56 V61 L93 61 C73 61 62 50 62 39 C62 26 73 18 87 18 C99 18 107 24 110 32 L138 32 V36 L124 36 V62 H114 V36 L94 36 Z"
          fill={colors.text}
          opacity="0.98"
        />

        {/* Main Brand Title: TREND */}
        <text
          x="120"
          y="48"
          fill={colors.text}
          fontFamily="Playfair Display, 'Didot', 'Bodoni MT', Georgia, serif"
          fontSize="41"
          fontWeight="800"
          letterSpacing="4"
        >
          TREND
        </text>

        {/* Main Brand Title: STREET */}
        <text
          x="78"
          y="78"
          fill={colors.text}
          fontFamily="Playfair Display, 'Didot', 'Bodoni MT', Georgia, serif"
          fontSize="40"
          fontWeight="800"
          letterSpacing="3"
        >
          STREET
        </text>

        {/* Subtitle Underline Accent */}
        <path
          d="M78 85 C145 84 200 84 262 85"
          stroke={colors.tagline}
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* Subtitle: THE STYLE HUB */}
        {showTagline && (
          <text
            x="170"
            y="94"
            textAnchor="middle"
            fill={colors.tagline}
            fontFamily="Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, sans-serif"
            fontSize="10"
            fontWeight="600"
            letterSpacing="7.5"
            opacity="0.9"
          >
            THE STYLE HUB
          </text>
        )}
      </svg>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-burgundy/20 rounded">
        {content}
      </Link>
    );
  }

  return content;
};
