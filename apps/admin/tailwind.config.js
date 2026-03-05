/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f3',
          100: '#fde6e9',
          500: '#e94560',
          600: '#d63854',
          700: '#b42d45',
        },
        dark: {
          900: '#0f0f23',
          800: '#1a1a2e',
          700: '#2a2a4a',
          600: '#3a3a5a',
        },
      },
    },
  },
  plugins: [],
};
