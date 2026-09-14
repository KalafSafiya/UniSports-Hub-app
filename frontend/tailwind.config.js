/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}", // all JS/React files
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // example primary color
        "background-dark": "#111827", // for dark mode background
      },
    },
  },
  darkMode: "class", // enable dark mode with a class
  plugins: [],
};
