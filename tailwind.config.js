/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        brand: {
          primary: 'var(--brand-primary)',
          strong: 'var(--brand-primary-strong)',
          accent: 'var(--brand-accent)',
        },
        status: {
          normal: 'var(--status-normal)',
          warning: 'var(--status-warning)',
          alert: 'var(--status-alert)',
          critical: 'var(--status-critical)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
