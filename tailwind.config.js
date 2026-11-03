/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0D',        // глубокий чёрный, основной фон
        graphite: '#171719',   // графитовый, фон секций
        slate: '#242426',      // тёмно-серый, линии и поверхности
        gold: '#C9A968',       // благородный золотой, акцент
        'gold-light': '#D8BA7A',
        paper: '#F7F6F2',      // белый, основной текст
        mist: '#B8B8B8',       // вторичный текст
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Manrope', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1320px',
      },
      letterSpacing: {
        label: '0.22em',
      },
      transitionTimingFunction: {
        arch: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
