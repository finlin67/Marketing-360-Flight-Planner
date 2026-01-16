/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'dash': 'dash-animation 1s linear infinite',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
