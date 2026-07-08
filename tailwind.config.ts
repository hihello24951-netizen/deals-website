import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // We enable arbitrary variants to allow for advanced group-hover and child selectors seamlessly
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Renamed to semantic design tokens. Brand is now a luxury 'Ink' black.
        ink: {
          DEFAULT: "#0B0F19",
          muted: "#1E293B",
          light: "#475569",
        },
        // A more vibrant, luxury-tier neon orange/coral accent
        accent: {
          DEFAULT: "#FF5A1F", 
          hover: "#E0430D",
          alpha: "rgba(255, 90, 31, 0.08)", // Perfect for subtle badge backgrounds
        },
        // Clean canvas colors that support light/dark transitions beautifully
        canvas: {
          base: "#F8FAFC",
          card: "#FFFFFF",
          dark: "#0B0F19"
        },
        // System borders optimized for sleek 1px glassmorphism lines
        glass: {
          border: "rgba(15, 23, 42, 0.06)",
          "border-dark": "rgba(255, 255, 255, 0.08)",
        }
      },
      borderRadius: {
        // Award-winning sites favor either sharp brutalism or beautifully organic soft corners
        "card": "1rem",
        "pill": "9999px",
        "inner": "0.75rem" // For nesting items perfectly inside cards without corner overlap
      },
      boxShadow: {
        // Layered fine-art shadows. They look almost invisible but provide depth.
        "premium": "0 2px 8px -2px rgba(11, 15, 25, 0.02), 0 12px 32px -4px rgba(11, 15, 25, 0.04)",
        "premium-hover": "0 4px 16px -4px rgba(255, 90, 31, 0.04), 0 24px 64px -8px rgba(11, 15, 25, 0.12)",
        "glow": "0 0 40px -10px rgba(255, 90, 31, 0.2)",
      },
      fontFamily: {
        // Dynamic Typography Pairing: A high-fashion display font paired with a hyper-readable body font
        display: ["var(--font-clash-display)", "DisplaySans", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jet-brains)", "monospace"],
      },
      animation: {
        // Multi-layered cinematic entrance animations
        "card-reveal": "cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        cardReveal: {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        }
      },
    },
  },
  plugins: [],
};

export default config;