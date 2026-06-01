/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A56DB',
        dark: '#0D1B2A',
        success: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
        background: '#F9FAFB',
        card: '#FFFFFF',
        border: '#E5E7EB',
        'text-dark': '#1F2937',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'page-title': ['24px', { fontWeight: '700' }],
        'section': ['18px', { fontWeight: '600' }],
        'body': ['14px', { fontWeight: '400' }],
        'small': ['12px', { fontWeight: '400' }],
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
