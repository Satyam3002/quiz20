/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        customGreen: '#d5e09c',
        customGray: '#9e9e9e',
        lightGreen: '#7d8361',
        lightGray: '#8d8e90',
        customBlue: '#2196f3',
        customBlack: '#252525',
      },
    },
  },
  plugins: [],
};
