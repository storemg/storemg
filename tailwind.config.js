/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta MG Store — estilo apple.com/br: branco/off-white,
        // preto puro nas seções de destaque, azul como único acento.
        ink: {
          950: '#000000',
          900: '#0a0a0c',
          800: '#1d1d1f',
          700: '#3a3a3d',
        },
        paper: {
          DEFAULT: '#ffffff',
          dim: '#f5f5f7',
        },
        muted: '#6e6e73',
        brand: {
          50: '#e8f2ff',
          100: '#cfe6ff',
          400: '#3395f2',
          500: '#0071e3',
          600: '#0077ed',
          700: '#0059b3',
        },
        // mantido para o painel admin (tema escuro à parte)
        flare: {
          400: '#ff9d4d',
          500: '#ff7a1a',
          600: '#e6650a',
        },
      },
      borderRadius: {
        pill: '980px',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatySm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        loadbar: {
          '0%': { transform: 'scaleX(0)', opacity: '0.3' },
          '60%': { transform: 'scaleX(1)', opacity: '1' },
          '100%': { transform: 'scaleX(1)', opacity: '0' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'floaty 8s cubic-bezier(.5,0,0,1) infinite',
        'float-sm': 'floatySm 6s cubic-bezier(.5,0,0,1) infinite',
        loadbar: 'loadbar 1.15s cubic-bezier(.5,0,0,1) infinite',
        'fade-in-up': 'fadeInUp .7s cubic-bezier(.5,0,0,1) both',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
