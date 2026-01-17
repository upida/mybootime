/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-pink-blue': 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
      },
    },
  },
  plugins: [],
}
