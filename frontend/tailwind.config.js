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
        surface:   '#F8FAFC', // Slate 50
        canvas:    '#FFFFFF',
        border:    '#E2E8F0', // Slate 200
        muted:     '#64748B', // Slate 500
        primary:   '#0F172A', // Slate 900
        secondary: '#334155', // Slate 700
        accent:    '#3B82F6', // Blue 500
        accentHover: '#2563EB', // Blue 600
        accentLight: '#EFF6FF', // Blue 50
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(0,0,0,0.05), 0 4px 12px 0 rgba(0,0,0,0.02)',
        'btn':     '0 1px 2px 0 rgba(0,0,0,0.05)',
        'btn-em':  '0 4px 12px 0 rgba(59,130,246,0.25)',
      }
    },
  },
  plugins: [],
}
