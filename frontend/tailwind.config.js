/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12172B',
          light: '#1C2340',
          faint: '#2A3153'
        },
        paper: '#E9EBF1',
        paperDark: '#DDE0EA',
        mint: {
          DEFAULT: '#3DDC97',
          dim: '#2FA976'
        },
        amber: {
          DEFAULT: '#FFB020',
          dim: '#C98613'
        }
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      keyframes: {
        scanbeam: {
          '0%':   { transform: 'translateY(-10%)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translateY(110%)', opacity: '0' }
        },
        stampIn: {
          '0%':   { transform: 'scale(1.6) rotate(-8deg)', opacity: '0' },
          '60%':  { transform: 'scale(0.96) rotate(-4deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-4deg)', opacity: '1' }
        }
      },
      animation: {
        scanbeam: 'scanbeam 1.6s ease-in-out infinite',
        stampIn: 'stampIn 0.5s cubic-bezier(.2,.8,.3,1.2) forwards'
      }
    },
  },
  plugins: [],
}
