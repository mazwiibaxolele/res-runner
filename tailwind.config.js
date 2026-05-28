/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#16A34A', // Green
          secondary: '#86EFAC',
          accent: '#FDE047', // Yellow
          bg: '#F8FAFC', // Off-white
          text: '#0F172A',
          muted: '#475569',
          surface: '#FFFFFF',
        }
      },
      fontFamily: {
        heading: ['"Varela Round"', 'sans-serif'],
        body: ['"Nunito Sans"', 'sans-serif'],
      },
      boxShadow: {
        'clay-card': '8px 8px 16px rgba(0,0,0,0.06), -8px -8px 16px rgba(255,255,255,0.8)',
        'clay-btn': '4px 4px 8px rgba(0,0,0,0.08), -4px -4px 8px rgba(255,255,255,0.8)',
        'clay-btn-inner': 'inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.8)',
        'clay-input': 'inset 4px 4px 8px rgba(0,0,0,0.04), inset -4px -4px 8px rgba(255,255,255,0.6)',
      },
      animation: {
        'soft-bounce': 'softBounce 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        softBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
