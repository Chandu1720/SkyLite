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
          gold: '#3B82F6', // Mapped to electric radiant blue
          primary: '#2563EB', // Royal Blue
          secondary: '#38BDF8', // Cyan / Sky Blue
          accent: '#60A5FA', // Ice Blue
          sapphire: '#1D4ED8', // Deep Sapphire
          royal: '#1E40AF', // Royal Navy
          dark: '#0B132B', // Deep Luxury Navy
          darker: '#060B18', // Cosmic Midnight Navy
          light: '#F8FAFC', // Crisp Ice White
          goldAccent: '#F59E0B', // Sunburst Gold
          rose: '#EC4899',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' },
          '50%': { opacity: '.8', boxShadow: '0 0 25px rgba(59, 130, 246, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
