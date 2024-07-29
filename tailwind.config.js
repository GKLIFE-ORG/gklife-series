/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#47c9ff",
        "section-dark-0": "#141414",
        "section-dark-1": "#2D2F34",
        "section-dark-2": "#1d1d1d",
      },
      height: {
        navbar: "80px", // navbar height
      },
      spacing: {
        navbar: "80px", // top navbar
      },
      fontFamily: {
        "oswald": ["Oswald", "sans-serif"],
        "mulish": ["Mulish", "sans-serif"],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
