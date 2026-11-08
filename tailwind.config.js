/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        powder: '#dbe9f4',
        baby: '#bcd6ec',
        sky: '#9fc3e3',
        corn: '#7e9fd0',
        icy: '#eaf4fb',
        cream: '#fbf8f1',
        silver: '#c9d3dc',
        ink: '#41587a',
      },
      fontFamily: {
        script: ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Quicksand"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
