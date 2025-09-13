/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      colors: {
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          text: '#E1E1E1',
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Add custom animation utilities
    function({ addUtilities }) {
      addUtilities({
        '.glassmorphism': {
          'background': 'rgba(255, 255, 255, 0.7)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
        },
        '.glassmorphism-dark': {
          'background': 'rgba(30, 30, 30, 0.7)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
        },
        '.shimmer': {
          'position': 'relative',
          'overflow': 'hidden',
          '--shimmer-color': 'rgba(148, 163, 184, 0.1)',
          '&::after': {
            'position': 'absolute',
            'top': '0',
            'right': '0',
            'bottom': '0',
            'left': '0',
            'transform': 'translateX(-100%)',
            'background-image': 'linear-gradient(90deg, transparent, var(--shimmer-color), transparent)',
            'animation': 'shimmer 2s infinite',
            'content': '""',
          },
        },
      })
    },
  ],
}
