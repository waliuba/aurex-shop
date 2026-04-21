/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  // Prefix utilities so we don't clash with existing CSS classes (btn, card, etc.)
  prefix: 'tw-',
  corePlugins: {
    // Avoid Tailwind's reset affecting the existing styling system
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F4F8F9',
          secondary: '#1c3934',
          third: '#ced1c8',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

