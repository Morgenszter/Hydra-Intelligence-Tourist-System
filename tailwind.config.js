/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hydra: {
          bg: '#070d14',
          panel: 'rgba(7,13,20,0.96)',
          border: '#005f73',
          text: '#0a9396',
          neon: '#39ff14',
          dark: '#050a0f',
        },
      },
      fontFamily: {
        orbitron: ['"Orbitron"', 'sans-serif'],
        tech: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 20px #39ff14' },
          '50%': { boxShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
