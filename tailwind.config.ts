import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#1a1a1a',
          muted: '#4b5563',
          subtle: '#6b7280',
        },
        paper: {
          DEFAULT: '#fafaf7',
          card: '#ffffff',
          edge: '#e7e5e0',
        },
        signal: {
          DEFAULT: '#c2410c',
          soft: '#fed7aa',
          ring: '#fb923c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif Pro"', '"Iowan Old Style"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}

export default config
