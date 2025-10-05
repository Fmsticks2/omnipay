/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Include all default Tailwind colors
        ...colors,
        // Explicitly ensure purple colors are available
        purple: colors.purple,
        blue: colors.blue,
        // Keep some custom colors for compatibility
        border: "rgb(30 41 59 / 0.5)",
        input: "rgb(30 41 59 / 0.5)",
        ring: "rgb(139 92 246 / 0.5)",
        background: "rgb(15 23 42)",
        foreground: "rgb(248 250 252)",
        primary: {
          DEFAULT: "rgb(139 92 246)",
          foreground: "rgb(248 250 252)",
        },
        secondary: {
          DEFAULT: "rgb(30 41 59)",
          foreground: "rgb(248 250 252)",
        },
        destructive: {
          DEFAULT: "rgb(239 68 68)",
          foreground: "rgb(248 250 252)",
        },
        muted: {
          DEFAULT: "rgb(30 41 59)",
          foreground: "rgb(148 163 184)",
        },
        accent: {
          DEFAULT: "rgb(30 41 59)",
          foreground: "rgb(248 250 252)",
        },
        popover: {
          DEFAULT: "rgb(15 23 42)",
          foreground: "rgb(248 250 252)",
        },
        card: {
          DEFAULT: "rgb(15 23 42)",
          foreground: "rgb(248 250 252)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'particle-float': {
          '0%': { transform: 'translateY(100vh) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(100px)', opacity: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'particle-float': 'particle-float 20s infinite linear',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}