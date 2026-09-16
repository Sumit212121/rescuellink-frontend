/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-Vibrancy Emergency & Disaster CAD Theme
        signal: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        opsAmber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        oceanTeal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        marineBlue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        radarEmerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        tactical: {
          800: '#1e293b',
          850: '#131e33',
          900: '#0f172a',
          950: '#080d1a',
        },
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        emergency: {
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        nordic: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        slateNavy: {
          700: '#1e293b',
          800: '#131e33',
          850: '#0f172a',
          900: '#0b1120',
          950: '#060913',
        },
        surface: {
          warm: '#fbfaf6',
          stone: '#f5f4ef',
          elevated: '#ffffff',
        }
      },
      boxShadow: {
        'glow-red': '0 0 35px -5px rgba(225, 29, 72, 0.45)',
        'glow-cyan': '0 0 35px -5px rgba(14, 165, 233, 0.4)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.4)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.4)',
        'tactile': '0 2px 4px rgba(15, 23, 42, 0.04), 0 10px 24px -3px rgba(15, 23, 42, 0.07)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'radar-ping': {
          '0%': { transform: 'scale(1)', opacity: '0.85' },
          '80%, 100%': { transform: 'scale(2.4)', opacity: '0' }
        },
        'beacon-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.96)' }
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      animation: {
        'radar-ping': 'radar-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'beacon-glow': 'beacon-glow 2.5s ease-in-out infinite',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
      }
    },
  },
  plugins: [],
}
