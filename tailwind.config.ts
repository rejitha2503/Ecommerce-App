import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        brand: {
          primary: '#0f1111',
          primaryLight: '#232f3e',
          accent: '#febd69',
          accentHover: '#f3a847',
          teal: '#007185',
          tealHover: '#005f73',
          darkBg: '#0b0f19',
          darkCard: '#151c2c',
          darkBorder: '#1e293b',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
