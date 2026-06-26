/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        'midnight': {
          950: '#05060B',
          900: '#07081B',
          850: '#0A0D24',
          800: '#0C112E',
          750: '#0F1538',
          700: '#131B42',
          650: '#17204D',
          600: '#1B2659',
          550: '#202D66',
          500: '#253373',
        },
        'neon': {
          'mint': '#A3E6CF',
          'lavender': '#C9B5F0',
          'coral': '#F5B5BA',
          'sky': '#89CFF0',
          'gold': '#F5E6A3',
          'pink': '#F0A3D6',
        },
        'glass': {
          'card': 'rgba(255, 255, 255, 0.04)',
          'border': 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 255, 255, 0.15)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'floatSlow 12s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-30px) translateX(15px)' },
          '66%': { transform: 'translateY(15px) translateX(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-40px) translateX(-20px) rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 181, 240, 0.15), 0 0 60px rgba(201, 181, 240, 0.05)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 181, 240, 0.3), 0 0 100px rgba(163, 230, 207, 0.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
