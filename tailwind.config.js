/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#E8F3FF',
          100: '#BEDAFF',
          200: '#94BFFF',
          300: '#6AA3FF',
          400: '#4088FF',
          500: '#165DFF',
          600: '#0E42D2',
          700: '#0A2BA0',
          800: '#061A6E',
          900: '#030D3C',
        },
        medical: {
          rose: '#E8A87C',
          roseLight: '#F5D5C0',
          roseDark: '#D48A5A',
        },
        success: '#00B42A',
        warning: '#FF7D00',
        danger: '#F53F3F',
        info: '#722ED1',
        dark: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(22, 93, 255, 0.3)',
        'glow-green': '0 0 20px rgba(0, 180, 42, 0.3)',
        'glow-red': '0 0 20px rgba(245, 63, 63, 0.3)',
        'glow-purple': '0 0 20px rgba(114, 46, 209, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 30px rgba(22, 93, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(22, 93, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(22, 93, 255, 0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
