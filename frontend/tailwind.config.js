/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface:   '#F8FAF9',
        canvas:    '#FFFFFF',
        border:    '#E4EBE8',
        muted:     '#8A9E98',
        primary:   '#111C18',
        secondary: '#4A5E58',
      },
      boxShadow: {
        'card':    '0 1px 4px 0 rgba(0,0,0,0.06), 0 4px 16px 0 rgba(0,0,0,0.04)',
        'card-md': '0 2px 8px 0 rgba(0,0,0,0.08), 0 8px 24px 0 rgba(16,185,129,0.08)',
        'btn':     '0 1px 3px 0 rgba(0,0,0,0.1)',
        'btn-em':  '0 2px 8px 0 rgba(16,185,129,0.4)',
      }
    },
  },
  plugins: [],
}
