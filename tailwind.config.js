/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          forest: '#123D32',      // Primary: Deep Forest Green
          emerald: '#237A57',     // Secondary: Emerald Green
          emeraldHover: '#1B6346',
          sage: '#E7F2EC',        // Soft Sage
          sageHover: '#D9E8DF',
          white: '#FFFFFF',       // Main Background
          page: '#F4F7F5',        // Page Background
          text: '#263A32',        // Main Text
          muted: '#687A70',       // Secondary Text
          border: '#DFE8E1',      // Borders
          borderLight: '#EDF3EF',
          card: '#FFFFFF',        // White backgrounds for dashboards, tables, cards, forms
          cardHover: '#F7FAF8',

          // Compatibility mapping so existing components adopt the theme:
          midnight: '#123D32',    // Deep Forest Green
          deep: '#F4F7F5',        // Soft Page Background
          teal: '#237A57',        // Emerald Green
          tealHover: '#1B6346',
          cyan: '#237A57',
          violet: '#237A57',
          violetHover: '#1B6346',
          lavender: '#E7F2EC',
          amber: '#F59E0B',
        },
        severity: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#F59E0B',
          low: '#3B82F6',
          resolved: '#237A57'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'emerald-glow': '0 4px 20px -2px rgba(35, 122, 87, 0.25)',
        'forest-glow': '0 4px 20px -2px rgba(18, 61, 50, 0.25)',
        'soft-card': '0 1px 3px 0 rgba(18, 61, 50, 0.06), 0 1px 2px -1px rgba(18, 61, 50, 0.04)',
        'elevated-card': '0 10px 25px -5px rgba(18, 61, 50, 0.08), 0 8px 10px -6px rgba(18, 61, 50, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
