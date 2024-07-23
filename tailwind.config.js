/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "section-dark-0": "#040404",
        "section-dark-1": "#121212",
        "section-dark-2": "#1d1d1d",
      },
      height: {
        navbar: "80px",
      },
      spacing: {
        navbar: "80px",
      },
      fontFamily: {},
    },
  },
  plugins: [],
};
