/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-12deg)' },
          '50%': { transform: 'rotate(12deg)' },
        },
        wiggle_left: {
          '0%, 100%': { transform: 'rotate(25deg)' },
          '50%': { transform: 'rotate(-25deg)' },
        },
        wiggle_more: {
          '0%, 100%': { transform: 'rotate(10deg)' },
          '50%': { transform: 'rotate(-10deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        wiggle_left: 'wiggle_left 1s ease-in-out infinite',
        wiggle_more: 'wiggle_more 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
  safelist: [{
    pattern: /./
  }]
}
