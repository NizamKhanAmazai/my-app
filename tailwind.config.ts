import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)', 'sans-serif'],
        opensans: ['var(--font-open-sans)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        lato: ['var(--font-lato)', 'sans-serif'],
        lora: ['var(--font-lora)', 'serif'],

        // Optional semantic aliases (recommended)
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-roboto)', 'sans-serif'],
        premium: ['var(--font-lora)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;