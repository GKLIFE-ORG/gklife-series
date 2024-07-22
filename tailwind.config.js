/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      height: {
        navbar: "80px",
      },
      spacing: {
        navbar: "80px",
      },
    },
  },
  plugins: [],
};
