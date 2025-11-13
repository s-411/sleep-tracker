/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#201640',
        foreground: '#EAE6F7',
        primary: {
          DEFAULT: '#7C5CFF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#5A46D6',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#2DE0C6',
          foreground: '#042927',
        },
        muted: {
          DEFAULT: '#6E647E',
          foreground: '#BDB4C9',
        },
        card: {
          DEFAULT: '#2b2052',
          foreground: '#EAE6F7',
        },
        destructive: '#FF6B6B',
        border: '#201640',
        input: '#1d143b',
      },
      fontFamily: {
        heading: ['System'],
      },
    },
  },
  plugins: [],
};
